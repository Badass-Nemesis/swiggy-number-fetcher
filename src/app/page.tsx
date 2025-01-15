"use client";

import { useState } from "react";
import ApiKeyForm from "@/app/components/ApiKeyForm";
import NumberDisplay from "@/app/components/NumberDisplay";
import StatusDisplay from "@/app/components/StatusDisplay";
import { useFetchNumber } from "@/app/hooks/useFetchNumber";
import ThemeToggle from "@/app/components/ThemeToggle";

export default function Home() {
  const [apiKey, setApiKey] = useState<string | null>(null);
  const { number, accessId, status, error, startFetchingNumbers, handleCancel } = useFetchNumber();

  const handleApiKeySubmit = async (key: string) => {
    setApiKey(key);
    startFetchingNumbers(key);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-black dark:text-white">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex justify-end p-4">
          <ThemeToggle />
        </div>
        <h1 className="text-3xl font-bold text-center mb-8 md:text-4xl lg:text-5xl">
          Swiggy Number Checker
        </h1>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
          {!apiKey ? (
            <ApiKeyForm onSubmit={handleApiKeySubmit} />
          ) : (
            <>
              {number && accessId ? (
                <NumberDisplay
                  number={number}
                  accessId={accessId}
                  apiKey={apiKey}
                  onCancel={() => handleCancel(apiKey, accessId)}
                />
              ) : (
                <StatusDisplay status={status} message="Fetching a number..." />
              )}
              {error && <StatusDisplay status="error" message={error} />}
            </>
          )}
        </div>
      </div>
    </div>
  );
}