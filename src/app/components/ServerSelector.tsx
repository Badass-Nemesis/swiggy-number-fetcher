import React from 'react';

type Server = {
    id: string;
    name: string;
};

type ServerSelectorProps = {
    servers: Server[];
    selected: string[];
    onChange: (selected: string[]) => void;
    disabled?: boolean;
    className?: string;
};

export default function ServerSelector({
    servers,
    selected,
    onChange,
    disabled = false,
    className = ''
}: ServerSelectorProps) {
    const toggleServer = (serverId: string) => {
        if (disabled) return;
        onChange(
            selected.includes(serverId)
                ? selected.filter(id => id !== serverId)
                : [...selected, serverId]
        );
    };

    return (
        <div className={`grid grid-cols-2 md:grid-cols-3 gap-2 ${className}`}>
            {servers.map(server => (
                <div key={server.id} className="flex items-center">
                    <input
                        type="checkbox"
                        id={`server-${server.id}`}
                        checked={selected.includes(server.id)}
                        onChange={() => toggleServer(server.id)}
                        disabled={disabled}
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 disabled:opacity-50"
                    />
                    <label
                        htmlFor={`server-${server.id}`}
                        className={`ml-2 text-sm ${disabled ? 'text-gray-400' : 'text-gray-700 dark:text-gray-300'}`}
                    >
                        {server.name}
                    </label>
                </div>
            ))}
        </div>
    );
}