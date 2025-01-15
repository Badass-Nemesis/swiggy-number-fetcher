"use client";

import { useState } from "react";

interface ApiKeyFormProps {
    onSubmit: (apiKey: string) => void;
}

export default function ApiKeyForm({ onSubmit }: ApiKeyFormProps) {
    const [apiKey, setApiKey] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!apiKey.trim()) {
            setError("API key is required.");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            onSubmit(apiKey);
        } catch (err) {
            setError("Failed to process the API key. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto p-6 bg-white dark:bg-gray-800 shadow-md rounded-lg">
            <h1 className="text-2xl font-bold mb-4 text-gray-900 text-center dark:text-white">
                Enter NinjaOTP API Key
            </h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label
                        htmlFor="apiKey"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                        API Key
                    </label>
                    <input
                        type="text"
                        id="apiKey"
                        value={apiKey}
                        onChange={(e) => setApiKey(e.target.value)}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-600 dark:focus:border-blue-600 dark:bg-gray-700 dark:text-white"
                        placeholder="Enter your NinjaOTP API key"
                        required
                    />
                </div>
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full px-4 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-blue-700 dark:hover:bg-blue-800"
                >
                    {loading ? "Submitting..." : "Submit"}
                </button>
            </form>

            {error && (
                <div className="mt-4 p-4 bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-200 rounded-md">
                    {error}
                </div>
            )}
        </div>
    );
}