"use client";

import { useState, useEffect, useRef } from "react";
import { checkNumber } from "@/app/actions/checkNumber";
import { cancelNumber } from "@/app/actions/cancelNumber";
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

  useEffect(() => {
    isMounted.current = true;

    const checkRegistration = async () => {
      setStatus("loading");
      try {
        const result = await checkNumber(number.slice(2));
        if (isMounted.current) {
          if (result.status === "success") {
            setIsRegistered(result.isRegistered ?? null);

            if (result.isRegistered === true) {
              setStatus("success");
              setError("This number is registered. Cancelling and fetching a new number...");

              let timer = 5;
              setCountdown(timer);

              const countdownInterval = setInterval(() => {
                if (isMounted.current) {
                  timer--;
                  setCountdown(timer);

                  if (timer <= 0) {
                    clearInterval(countdownInterval);
                    setCountdown(null);
                  }
                }
              }, 1000);

              setTimeout(async () => {
                if (isMounted.current) {
                  try {
                    await cancelNumber(apiKey, accessId);
                    onCancel();
                  } catch (err) {
                    setError("Failed to cancel the number. Please try again.");
                    setStatus("error");
                  }
                }
              }, 5000);
            } else {
              setStatus("success");
              setError(null);
            }
          } else {
            setStatus("error");
            setError(result.message || "Failed to check number registration.");
          }
        }
      } catch (err) {
        if (isMounted.current) {
          setStatus("error");
          setError("Failed to check number registration. Please try again.");
        }
      }
    };

    checkRegistration();

    return () => {
      isMounted.current = false;
    };
  }, [number, accessId, apiKey, onCancel]);

  return (
    <div className="space-y-4">
      <div className="p-4 bg-green-100 border border-green-400 text-green-700 rounded-md">
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