"use client";

interface StatusDisplayProps {
    status: "idle" | "loading" | "success" | "error";
    result?: any;
    error?: string;
}

export default function StatusDisplay({ status, result, error }: StatusDisplayProps) {
    if (status === "idle") {
        return null;
    }

    return (
        <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-md">
            {status === "loading" && (
                <div className="flex items-center justify-center space-x-2">
                    <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-gray-700">Loading...</p>
                </div>
            )}

            {status === "error" && error && (
                <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded-md">
                    <p>{error}</p>
                </div>
            )}

            {status === "success" && result && (
                <div className="space-y-4">
                    <div className="p-4 bg-green-100 border border-green-400 text-green-700 rounded-md">
                        <p className="font-semibold">Success!</p>
                        <pre className="mt-2 text-sm">{JSON.stringify(result, null, 2)}</pre>
                    </div>
                </div>
            )}
        </div>
    );
}