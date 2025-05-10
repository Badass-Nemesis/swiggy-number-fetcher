import axios, { CancelTokenSource } from 'axios';
import apiResponse from '@/app/utils/addVOtpJobs';

type VOtpJob = {
    serverId: string;
    serviceKey: string;
    apiKey: string;
};

type LogEntry = {
    text: string;
    type: 'attempt' | 'success' | 'error' | 'info' | 'warning' | 'cancellation';
};

export default class VOtpShopQueue {
    private activeRequests: CancelTokenSource[] = [];
    private isStopped = false;
    private currentAttempt = 1;
    private serviceKeys: Record<string, string[]> = {};
    private currentAttemptLogs: LogEntry[] = [];

    constructor(
        private onLog: (log: LogEntry, isNewAttempt: boolean) => void,
        private onComplete: () => void
    ) { }

    async start(apiKey: string, serverIds: string[]) {
        this.isStopped = false;
        this.currentAttempt = 1;
        this.clearLogs(true);

        try {
            await this.fetchServiceKeys(apiKey, serverIds);
            await this.processJobs(apiKey);
        } catch (error) {
            this.addLog(
                `Initialization failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
                'error',
                false
            );
            this.stop();
        }
    }

    stop() {
        this.isStopped = true;
        this.activeRequests.forEach(source => source.cancel('Operation stopped'));
        this.activeRequests = [];
        this.onComplete();
    }

    private clearLogs(isNewAttempt: boolean) {
        this.currentAttemptLogs = [];
        this.onLog({ text: `=== Attempt ${this.currentAttempt} ===`, type: 'attempt' }, isNewAttempt);
    }

    private addLog(text: string, type: LogEntry['type'], isNewAttempt = false) {
        const logEntry: LogEntry = { text, type };
        this.currentAttemptLogs.push(logEntry);
        this.onLog(logEntry, isNewAttempt);
    }

    private async fetchServiceKeys(apiKey: string, serverIds: string[]) {
        this.addLog('Fetching service keys...', 'info', true);

        await Promise.all(
            serverIds.map(async serverId => {
                const source = axios.CancelToken.source();
                this.activeRequests.push(source);

                try {
                    const res = await axios.get('/api/proxy/votpshop', {
                        cancelToken: source.token,
                        params: {
                            apiKey: apiKey,
                            action: 'getServices',
                            serverId: serverId,
                            country: 22
                        }
                    });

                    // console.log(res.data.data); // debug

                    if (res.data?.status === "success") {
                        const services = res.data.data;
                        // Get ALL Swiggy keys
                        const swiggyKeys = Object.entries(services)
                            .filter(([_, name]) => String(name).toLowerCase().includes('swiggy'))
                            .map(([key]) => key);

                        if (swiggyKeys.length > 0) {
                            this.serviceKeys[serverId] = swiggyKeys;
                            this.addLog(
                                `Server ${serverId}: Found ${swiggyKeys.length} Swiggy service keys`,
                                'success'
                            );
                        } else {
                            this.addLog(`Server ${serverId}: No Swiggy service found`, 'warning');
                        }
                    }
                } catch (error) {
                    if (!axios.isCancel(error)) {
                        this.addLog(`Server ${serverId}: Failed to fetch services`, 'error');
                    }
                } finally {
                    this.activeRequests = this.activeRequests.filter(req => req !== source);
                }
            })
        );
    }

    private async addJobsIfNotExists(jobsArray: VOtpJob[], newJobsData: Array<{ id: string, operator: string }>, apiKey: string) {
        const existingServerIds = new Set(jobsArray.map(job => job.serverId));

        for (const jobData of newJobsData) {
            const alreadyExists = jobsArray.some(job => job.serviceKey === jobData.id);
            const hasMatchingServerId = existingServerIds.has(jobData.operator);

            // Only add if:
            // 1. The serviceKey (id) doesn't already exist in jobsArray
            // 2. The operator (serverId) matches an existing serverId in jobsArray
            if (!alreadyExists && hasMatchingServerId) {
                jobsArray.push({ serverId: jobData.operator, serviceKey: jobData.id, apiKey: apiKey });
            }
        }
    }

    private async processJobs(apiKey: string) {
        const jobs: VOtpJob[] = [];

        Object.entries(this.serviceKeys).forEach(([serverId, serviceKeys]) => {
            serviceKeys.forEach(serviceKey => {
                jobs.push({ serverId, serviceKey, apiKey });
            });
        });

        const jobsToAdd = apiResponse.data.map(item => ({
            id: item.id,
            operator: item.operator
        }));

        this.addJobsIfNotExists(jobs, jobsToAdd, apiKey);

        while (!this.isStopped) {
            this.clearLogs(true);

            for (const job of jobs) {
                if (this.isStopped) break;

                const source = axios.CancelToken.source();
                this.activeRequests.push(source);

                try {
                    this.addLog(`Trying Server ${job.serverId} (Service: ${job.serviceKey})...`, 'info');

                    const { number, accessId } = await this.fetchNumber(job, source.token);
                    if (!number) continue;

                    this.addLog('Checking number registration...', 'info');
                    const isRegistered = await this.checkNumber(number);

                    if (!isRegistered) {
                        // Just show the blinking log (no onResult call)
                        this.addLog(`✅ Valid number found: +91 ${number.slice(2)}`, 'success');
                        this.stop();
                        return;
                    }

                    this.addLog('Number registered, cancelling...', 'warning');
                    await this.cancelNumber(job, accessId);
                    this.addLog('Number cancelled successfully', 'cancellation');

                } catch (error) {
                    if (!axios.isCancel(error)) {
                        const errorMessage = error instanceof Error ? error.message : 'Error';
                        this.addLog(`Server ${job.serverId}: ${errorMessage}`, 'error');

                        // Check for NO_BALANCE error
                        if (errorMessage.includes('NO_BALANCE')) {
                            this.addLog('❌ Fatal Error: No balance left!', 'error');
                            this.stop();
                            return;
                        }
                    }
                } finally {
                    this.activeRequests = this.activeRequests.filter(req => req !== source);
                }
            }

            this.currentAttempt++;
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
    }

    private async fetchNumber(job: VOtpJob, cancelToken: any) {
        const res = await axios.get('/api/proxy/votpshop', {
            cancelToken,
            params: {
                apiKey: job.apiKey,
                action: 'getNumber',
                service: job.serviceKey,
                serverId: job.serverId,
                country: 22
            }
        });

        if (res.data?.status === "success" && res.data?.data?.includes('ACCESS_NUMBER')) {
            const [_, accessId, number] = res.data.data.split(':');
            return { number, accessId };
        }
        throw new Error(res.data?.data || 'No number available');
    }

    private async checkNumber(number: string) {
        try {
            const res = await axios.post(
                '/api/checknumber',
                { phoneNumber: number.slice(2) },
                { headers: { 'Content-Type': 'application/json' } } // adding this because gpt said it's best practice
            );

            if (res.data.status !== "success") {
                throw new Error(res.data.message || "Verification failed");
            }

            return res.data.isRegistered as boolean;
        } catch (error) {
            console.error('Check number error:', error);
            return true; // I'll assume it's registered if the check fails 
        }
    }

    private async cancelNumber(job: VOtpJob, accessId: string) {
        const res = await axios.get('/api/proxy/votpshop', {
            params: {
                apiKey: job.apiKey,
                action: 'setStatus',
                id: accessId
            }
        });

        // Verify cancellation was successful
        if (res.data.data !== "ACCESS_CANCEL" && res.data.data !== "ACCESS_CANCEL_ALREADY") {
            this.addLog(`Server ${job.serverId}: Number wasn't cancelled properly. 
                Please cancel the number and restart the fetching`, 'error');
            // this.stop(); // disabled only for VOtpShop service
            throw new Error(`Cancellation failed: ${res.data.data}`);
        }
    }
}