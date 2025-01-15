"use client";

import { useState } from "react";
import NumberForm from "@/app/components/NumberForm";
import StatusDisplay from "@/app/components/StatusDisplay";
import { fetchNumberDetails } from "@/app/actions/fetchNumberDetails";

export default function Home() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleCheckNumber = async (phoneNumber: string) => {
    setStatus("loading");
    setError(null);
    setResult(null);

    try {
      const details = await fetchNumberDetails(phoneNumber);
      setResult(details);
      setStatus("success");
    } catch (err) {
      setError("Failed to fetch number details. Please try again.");
      setStatus("error");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-8">Phone Number Checker</h1>
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <NumberForm onSubmit={handleCheckNumber} />
          <StatusDisplay status={status} result={result} error={error} />
        </div>
      </div>
    </div>
  );
}