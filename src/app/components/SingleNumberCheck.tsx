"use client";

import { useState } from "react";
import StatusDisplay from "@/app/components/StatusDisplay";

export default function SingleNumberCheck() {
    const [phoneNumber, setPhoneNumber] = useState("");
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
    const [isRegistered, setIsRegistered] = useState<boolean | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleCheckNumber = async () => {
        if (!phoneNumber || phoneNumber.length !== 10) {
            setError("Please enter a valid 10-digit number.");
            return;
        }

        setStatus("loading");
        setError(null);

        try {
            const response = await fetch("/api/checknumber", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ phoneNumber }),
            });

            const result = await response.json();

            if (result.status === "success") {
                setIsRegistered(result.isRegistered);
                setStatus("success");
            } else {
                setError(result.message || "Failed to check number registration.");
                setStatus("error");
            }
        } catch (err) {
            setError("Failed to check number registration. Please try again.");
            setStatus("error");
        }
    };

    return (
        <div className="max-w-md mx-auto md:p-6 bg-white dark:bg-gray-800 shadow-md rounded-lg">
            <h2 className=" text-xl md:text-2xl font-bold mb-4 text-gray-900 text-center dark:text-white">
                Check Single Number
            </h2>

            <div className="flex items-center gap-2 w-full">
                <div className="flex-shrink-0 flex items-center border border-gray-300 dark:border-gray-600 rounded-md p-2 bg-gray-100 dark:bg-gray-700">
                    <span className="text-gray-700 dark:text-gray-300">+91</span>
                </div>

                <input
                    type="text"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, "").slice(0, 10))}
                    className="flex-1 min-w-0 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white placeholder:truncate"
                    placeholder="Enter 10-digit number"
                    maxLength={10}
                />
            </div>

            <button
                onClick={handleCheckNumber}
                disabled={status === "loading"}
                className="w-full mt-4 px-4 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-blue-700 dark:hover:bg-blue-800"
            >
                {status === "loading" ? "Checking..." : "Check Number"}
            </button>

            {status === "loading" && (
                <div className="mt-4">
                    <StatusDisplay status="loading" message="Checking number registration..." />
                </div>
            )}

            {status === "success" && isRegistered !== null && (
                <div className="mt-4">
                    <StatusDisplay
                        status={isRegistered ? "error" : "success"}
                        message={isRegistered ? "This number is registered." : "This number is not registered."}
                    />
                </div>
            )}

            {error && (
                <div className="mt-4">
                    <StatusDisplay status="error" message={error} />
                </div>
            )}
        </div>
    );
}