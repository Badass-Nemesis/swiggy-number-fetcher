"use client";

import { useState, useEffect, useRef } from "react";
import StatusDisplay from "@/app/components/StatusDisplay";

interface NumberDisplayProps {
  number: string;
  accessId: string;
  apiKey: string;
  onCancel: () => void;
}

export default function NumberDisplay({ number, accessId, apiKey, onCancel }: NumberDisplayProps) {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("loading");
  const [isRegistered, setIsRegistered] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [countdown, setCountdown] = useState<number | null>(null);
  const isMounted = useRef(true);
  const hasChecked = useRef(false);

  const startCountdown = () => {
    let timer = 5;
    setCountdown(timer);

    const countdownInterval = setInterval(() => {
      if (isMounted.current) {
        timer--;
        setCountdown(timer);

        if (timer <= 0) {
          clearInterval(countdownInterval);
          setCountdown(0);
          onCancel(); // triggering the cancellation after countdown
        }
      }
    }, 1000);
  };

  const handleApiResponse = (result: any) => {
    if (result.status === "success") {
      setIsRegistered(result.isRegistered ?? null);
      setStatus("success");

      if (result.isRegistered === true) {
        startCountdown(); // start countdown to cancel the number
      } else {
        setError(null); // error should be null here because the number is not registered
      }
    } else {
      setStatus("error");
      setError(result.message || "Failed to check number registration.");
    }
  };

  const checkRegistration = async () => {
    if (hasChecked.current) return; // skipping if already checked, thus fixing multiple calls error
    hasChecked.current = true;

    setStatus("loading");

    try {
      const response = await fetch("/api/checkNumber", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ phoneNumber: number.slice(2) }),
      });

      const result = await response.json();

      if (isMounted.current) {
        handleApiResponse(result);
      }
    } catch (err) {
      if (isMounted.current) {
        setStatus("error");
        setError("Failed to check number registration. Please try again.");
      }
    }
  };

  useEffect(() => {
    isMounted.current = true;
    checkRegistration();

    return () => {
      isMounted.current = false; // cleanup moment on unmount
    };
  }, [number, onCancel]);

  return (
    <div className="space-y-4">
      <div className="p-4 bg-green-100 dark:bg-green-900 border border-green-400 dark:border-green-700 text-green-700 dark:text-green-200 rounded-md">
        <p className="font-semibold">Number Fetched Successfully!</p>
        <p className="mt-2">Number: +{number}</p>
      </div>

      {status === "loading" && (
        <StatusDisplay status="loading" message="Checking number registration..." />
      )}

      {status === "success" && isRegistered !== null && (
        <div className="space-y-4">
          {isRegistered ? (
            <StatusDisplay
              status="error"
              message={`This number is registered. Cancelling and fetching a new number in ${countdown} seconds...`}
            />
          ) : (
            <StatusDisplay
              status="success"
              message="This number is not registered. You can now go to NinjaOTP to get the code."
            />
          )}
        </div>
      )}

      {error && <StatusDisplay status="error" message={error} />}
    </div>
  );
}