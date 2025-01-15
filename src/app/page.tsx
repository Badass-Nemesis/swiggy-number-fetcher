"use client";

import { useState } from "react";
import ApiKeyForm from "@/app/components/ApiKeyForm";
import NumberDisplay from "@/app/components/NumberDisplay";
import StatusDisplay from "@/app/components/StatusDisplay";
import { fetchNumber } from "@/app/actions/fetchNumber";
import { cancelNumber } from "@/app/actions/cancelNumber";
import ThemeToggle from "@/app/components/ThemeToggle";

export default function Home() {
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [number, setNumber] = useState<string | null>(null);
  const [accessId, setAccessId] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  const handleApiKeySubmit = async (key: string) => {
    setApiKey(key);
    setStatus("loading");
    setError(null);
    startFetchingNumbers(key);
  };

  const startFetchingNumbers = async (key: string) => {
    setStatus("loading");
    while (true) {
      try {
        const result = await fetchNumber(key);
        if (result.status === "success") {
          setAccessId(result.access_id);
          setNumber(result.number);
          setStatus("success");
          break;
        } else if (result.status === "retry") {
          setStatus("loading");
          await new Promise((resolve) => setTimeout(resolve, 5000));
        } else {
          throw new Error("Failed to fetch a number. Please try again.");
        }
      } catch (err) {
        setError("Failed to fetch or check number. Please try again.");
        setStatus("error");
        break;
      }
    }
  };

  const handleCancel = async () => {
    if (apiKey && accessId) {
      setStatus("loading");
      try {
        await cancelNumber(apiKey, accessId);
        setNumber(null);
        setAccessId(null);
        startFetchingNumbers(apiKey);
      } catch (err) {
        setError("Failed to cancel the number. Please try again.");
        setStatus("error");
      }
    }
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
                  onCancel={handleCancel}
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