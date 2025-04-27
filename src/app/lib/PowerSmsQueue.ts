import axios, { CancelTokenSource } from 'axios';

type PowerSmsJob = {
    server: string;
    service: string;
    apiKey: string;
};

type LogEntry = {
    text: string;
    type: 'attempt' | 'success' | 'error' | 'info' | 'warning' | 'cancellation';
};

interface ServiceEntry {
    server_code: string;
    service_code: string;
}

export default class PowerSmsQueue {
    private activeRequests: CancelTokenSource[] = [];
    private isStopped = false;
    private currentAttempt = 1;
    private validCombinations: { server: string; service: string }[] = [];
    private currentAttemptLogs: LogEntry[] = [];

    constructor(
        private onLog: (log: LogEntry, isNewAttempt: boolean) => void,
        private onComplete: () => void,
        private servers: string[],
    ) { }

    async start(apiKey: string) {
        this.isStopped = false;
        this.currentAttempt = 1;
        this.clearLogs(true);

        try {
            await this.fetchServiceKeys(apiKey);
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

    private async fetchServiceKeys(apiKey: string) {
        this.addLog('Fetching service keys...', 'info', true);

        const source = axios.CancelToken.source();
        this.activeRequests.push(source);

        try {
            const res = await axios.get('/api/proxy/powersms', {
                cancelToken: source.token,
                params: {
                    apiKey: apiKey,
                    action: 'getServices'
                }
            });

            const servicesData = res.data.data;
            // console.log(servicesData); // debug

            // Type guard to check if the value is a ServiceEntry array
            function isServiceEntryArray(value: unknown): value is ServiceEntry[] {
                return Array.isArray(value) &&
                    value.every(item =>
                        typeof item === 'object' &&
                        item !== null &&
                        'server_code' in item &&
                        'service_code' in item
                    );
            }

            // Find all target service-related services
            Object.entries(servicesData).forEach(([serviceName, entries]) => {
                if (serviceName.toLowerCase().includes("swiggy")) {
                    if (isServiceEntryArray(entries)) {
                        entries.forEach(entry => {
                            if (this.servers.includes(entry.server_code)) {
                                this.validCombinations.push({
                                    server: entry.server_code,
                                    service: entry.service_code
                                });
                            }
                        });
                    } else {
                        console.warn(`Unexpected entries format for service: ${serviceName}`);
                    }
                }
            });

            if (this.validCombinations.length === 0) {
                throw new Error('No valid swiggy services found for the specified servers!');
            }

            this.addLog('✅ Valid Server-Service Combinations:', 'success');
            this.validCombinations.forEach(comb => {
                this.addLog(`  Server ${comb.server} → Service: ${comb.service}`, 'info');
            });

        } catch (error) {
            if (!axios.isCancel(error)) {
                throw error;
            }
        } finally {
            this.activeRequests = this.activeRequests.filter(req => req !== source);
        }
    }

    private async processJobs(apiKey: string) {
        const jobs: PowerSmsJob[] = this.validCombinations.map(comb => ({
            server: comb.server,
            service: comb.service,
            apiKey
        }));

        while (!this.isStopped) {
            this.clearLogs(true);

            for (const job of jobs) {
                if (this.isStopped) break;

                const source = axios.CancelToken.source();
                this.activeRequests.push(source);

                try {
                    this.addLog(`Trying Server ${job.server} (Service: ${job.service})...`, 'info');

                    const { number, orderId } = await this.fetchNumber(job, source.token);
                    if (!number) continue;

                    this.addLog('Checking number registration...', 'info');
                    const isRegistered = await this.checkNumber(number);

                    if (!isRegistered) {
                        this.addLog(`✅ Valid number found: +91 ${number.slice(2)}`, 'success');
                        this.stop();
                        return;
                    }

                    this.addLog('Number registered, cancelling...', 'warning');
                    await this.cancelNumber(job, orderId);
                    this.addLog('Number cancelled successfully', 'cancellation');

                } catch (error) {
                    if (!axios.isCancel(error)) {
                        const errorMessage = error instanceof Error ? error.message : 'Error';
                        this.addLog(`Server ${job.server}: ${errorMessage}`, 'error');

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

                await new Promise(resolve => setTimeout(resolve, 1000));
            }

            this.currentAttempt++;
        }
    }

    private async fetchNumber(job: PowerSmsJob, cancelToken: any) {
        const res = await axios.get('/api/proxy/powersms', {
            cancelToken,
            params: {
                apiKey: job.apiKey,
                action: 'getNumber',
                service: job.service,
                serverId: job.server
            }
        });

        const data = res.data.data;

        if (typeof data === 'string' && data.includes('ACCESS_NUMBER')) {
            const [_, orderId, number] = data.split(':');
            return { number, orderId };
        }
        throw new Error(data || 'No number available');
    }

    private async checkNumber(number: string) {
        try {
            const res = await axios.post(
                '/api/checknumber',
                { phoneNumber: number.slice(2) },
                { headers: { 'Content-Type': 'application/json' } }
            );

            if (res.data.status !== "success") {
                throw new Error(res.data.message || "Verification failed");
            }

            return res.data.isRegistered as boolean;
        } catch (error) {
            console.error('Check number error:', error);
            return true; // Assume it's registered if the check fails
        }
    }

    private async cancelNumber(job: PowerSmsJob, orderId: string) {
        const res = await axios.get('/api/proxy/powersms', {
            params: {
                apiKey: job.apiKey,
                action: 'setStatus',
                id: orderId
            }
        });

        const data = res.data.data;

        // Verify cancellation was successful
        if (typeof data === 'string' &&
            (data !== "ACCESS_CANCEL" && data !== "ACCESS_CANCEL_ALREADY")) {
            this.addLog(`Server ${job.server}: Number wasn't cancelled properly. 
                Please cancel the number and restart the fetching`, 'error');
            this.stop();
            throw new Error(`Cancellation failed: ${data}`);
        }
    }
}