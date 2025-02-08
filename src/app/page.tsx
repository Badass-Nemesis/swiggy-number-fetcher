"use client";

import { useState, useEffect } from "react";
import ApiKeyForm from "@/app/components/ApiKeyForm";
import NumberDisplay from "@/app/components/NumberDisplay";
import StatusDisplay from "@/app/components/StatusDisplay";
import { useFetchNumber } from "@/app/hooks/useFetchNumber";
import ThemeToggle from "@/app/components/ThemeToggle";
import SingleNumberCheck from "@/app/components/SingleNumberCheck";
import ServerSelection from "./components/ServerSelection";

export default function Home() {
  const [apiKey, setApiKey] = useState<string | null>(null);
  const { number, accessId, status, error, serverId, setServerId, startFetchingNumbers, handleCancel } = useFetchNumber();
  const [mode, setMode] = useState<"fetch" | "single">("fetch"); // using this state to toggle between modes

  // prevent calling the function multiple times
  useEffect(() => {
    if (apiKey && status !== "loading" && mode === "fetch") {
      startFetchingNumbers(apiKey);
    }
  }, [apiKey, mode]); // had to add mode as a dependency

  const handleApiKeySubmit = async (key: string) => {
    if (status === "loading") return; // i don't know why I did this
    setApiKey(key);
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

        {/* these are the two toggle buttons */}
        <div className="flex justify-center gap-4 mb-8">
          <button
            onClick={() => setMode("fetch")}
            className={`px-4 py-2 rounded-lg ${mode === "fetch" ? "bg-blue-600 text-white" : "bg-gray-200 dark:bg-gray-700"
              }`}
          >
            Automatically Fetch
          </button>
          <button
            onClick={() => setMode("single")}
            className={`px-4 py-2 rounded-lg ${mode === "single" ? "bg-blue-600 text-white" : "bg-gray-200 dark:bg-gray-700"
              }`}
          >
            Check Single Number
          </button>
        </div>

        {/* this is the server selection dropdown */} 
        {mode === "fetch" && <ServerSelection serverId={serverId} setServerId={setServerId} />}

        {/* rendering appropriate component form based on the mode */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
          {mode === "fetch" ? (
            !apiKey ? (
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
                  !error && <StatusDisplay status={status} message="Fetching a number..." />
                )}
                {error && <StatusDisplay status="error" message={error} />}
              </>
            )
          ) : (
            <SingleNumberCheck />
          )}
        </div>
      </div>
    </div>
  );
}