import React, { useState, useRef, useEffect } from 'react';
import VOtpShopQueue from '@/app/lib/VOtpShopQueue';
import ServerSelector from '@/app/components/ServerSelector';

const VOTP_SERVERS = [
    { id: "1", name: "Server 1" },
    { id: "2", name: "Server 2" },
    { id: "4", name: "Server 4" },
    { id: "5", name: "Server 5" },
    { id: "6", name: "Server 6" },
    { id: "7", name: "Server 7" },
    { id: "8", name: "Server 8" },
    { id: "9", name: "Server 9" }
];

const logTypeColors = {
    attempt: 'text-purple-600 dark:text-purple-300 font-bold',
    success: 'text-green-600 dark:text-green-400',
    error: 'text-red-600 dark:text-red-400',
    info: 'text-blue-600 dark:text-blue-300',
    warning: 'text-yellow-600 dark:text-yellow-400',
    cancellation: 'text-orange-600 dark:text-orange-400'
};

const blinkAnimation = `
@keyframes blink {
  0% { background-color: rgba(74, 222, 128, 0.2); }
  50% { background-color: rgba(74, 222, 128, 0.5); }
  100% { background-color: rgba(74, 222, 128, 0.2); }
}
`;

export default function VOtpShop() {
    const [apiKey, setApiKey] = useState('');
    const [selectedServers, setSelectedServers] = useState<string[]>([]);
    const [logs, setLogs] = useState<{ text: string, type: keyof typeof logTypeColors }[]>([]);
    const [isRunning, setIsRunning] = useState(false);
    const queueRef = useRef<VOtpShopQueue | null>(null);
    const logsContainerRef = useRef<HTMLDivElement>(null);

    const handleLog = (log: { text: string, type: keyof typeof logTypeColors }, isNewAttempt: boolean) => {
        setLogs(prev => isNewAttempt ? [log] : [...prev, log]);
    };

    const startFetching = () => {
        if (!apiKey || selectedServers.length === 0) return;

        setIsRunning(true);
        setLogs([{ text: 'Starting VOtpShop service...', type: 'info' }]);

        queueRef.current = new VOtpShopQueue(
            handleLog,
            () => setIsRunning(false)
        );

        queueRef.current.start(apiKey, selectedServers);
    };

    const stopFetching = () => {
        queueRef.current?.stop();
    };

    useEffect(() => {
        return () => queueRef.current?.stop();
    }, []);

    useEffect(() => {
        if (logsContainerRef.current) {
            logsContainerRef.current.scrollTop = logsContainerRef.current.scrollHeight;
        }
    }, [logs]);

    return (
        <div className="p-4 border rounded-lg bg-white dark:bg-gray-800 shadow-md">
            <h2 className="text-xl font-semibold mb-4 dark:text-white">VOtpShop</h2>

            <div className="flex justify-center items-center text-center text-sm font-medium text-blue-400 mb-4 border-2 rounded-md border-blue-200 px-3 py-2">
                Note: VOtpShop gave wrong cancel number api. So the automatic number cancellation doesn't work.
                You have to manually cancel the number. I have disabled the "fatal error stop service" in number cancellation
                failure for VOtpShop. So in case of NO_BALANCE error, just manually cancel the numbers and run the fetch again.
            </div>

            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium mb-1 dark:text-gray-300">
                        API Key
                    </label>
                    <input
                        value={apiKey}
                        onChange={(e) => setApiKey(e.target.value)}
                        disabled={isRunning}
                        className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-white disabled:opacity-50"
                        placeholder="Enter VOtpShop API key"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1 dark:text-gray-300">
                        Servers
                    </label>
                    <ServerSelector
                        servers={VOTP_SERVERS}
                        selected={selectedServers}
                        onChange={setSelectedServers}
                        disabled={isRunning}
                    />
                </div>

                <div className="flex space-x-2">
                    <button
                        onClick={isRunning ? stopFetching : startFetching}
                        disabled={!apiKey || selectedServers.length === 0}
                        className={`flex-1 py-2 px-4 rounded-md ${isRunning ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'
                            } text-white disabled:opacity-50`}
                    >
                        {isRunning ? 'Stop Fetching' : 'Start Fetching'}
                    </button>
                </div>

                <style>{blinkAnimation}</style>
                <div
                    ref={logsContainerRef}
                    className="mt-4 h-64 overflow-y-auto bg-gray-50 dark:bg-gray-900 p-3 rounded-md relative">
                    {logs.length > 0 ? (
                        <>
                            {logs.map((log, i) => (
                                <div
                                    key={i}
                                    className={`text-sm py-1 border-b dark:border-gray-700 ${logTypeColors[log.type]} ${log.type === 'success' ? 'animate-[blink_1.5s_ease-in-out_infinite] rounded px-2' : ''
                                        }`}
                                >
                                    {log.text}
                                </div>
                            ))}
                            {/* <div ref={logsEndRef} /> */}
                        </>
                    ) : (
                        <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                            Logs will appear here...
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}