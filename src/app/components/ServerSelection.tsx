interface ServerSelectionProps {
    serverId: number;
    setServerId: (serverId: number) => void;
    disabled?: boolean;
}

export default function ServerSelection({ serverId, setServerId, disabled }: ServerSelectionProps) {
    return (
        <div className="mt-4 mb-4 text-sm md:text-base">
            <label htmlFor="server" className="block font-medium text-gray-700 dark:text-gray-300">
                Select Server
            </label>
            <select
                id="server"
                value={serverId}
                onChange={(e) => setServerId(Number(e.target.value))}
                disabled={disabled}
                className={`mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
            >
                <option value={2}>Server 2 (Default)</option>
                <option value={5}>Server 5</option>
                <option value={1}>Server 1</option>
            </select>
        </div>
    );
}