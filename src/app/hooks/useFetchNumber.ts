import { useState } from "react";
import { fetchNumber } from "@/app/utils/fetchNumber";
import { cancelNumber } from "@/app/utils/cancelNumber";

export function useFetchNumber() {
    const [number, setNumber] = useState<string | null>(null);
    const [accessId, setAccessId] = useState<string | null>(null);
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
    const [error, setError] = useState<string | null>(null);

    const startFetchingNumbers = async (apiKey: string) => {
        if (status === "loading") return; // this is to prevent multiple calls
        setStatus("loading");
        while (true) {
            try {
                const result = await fetchNumber(apiKey);
                if (result.status === "success") {
                    setAccessId(result.access_id);
                    setNumber(result.number);
                    setStatus("success");
                    break;
                } else if (result.status === "retry") {
                    setStatus("loading");
                    await new Promise((resolve) => setTimeout(resolve, 5000));
                } else {
                    setError(`Failed to fetch a number. Please check if your apiKey is correct or not. API response: ${JSON.stringify(result)}`);
                    setStatus("error");
                    break;
                }
            } catch (err) {
                if (err instanceof Error) {
                    setError(`Failed to fetch or check number. Error: ${err.message}`);
                } else {
                    setError("Failed to fetch or check number. Please try again.");
                }
                setStatus("error");
                break;
            }
        }
    };

    const handleCancel = async (apiKey: string, accessId: string) => {
        if (status === "loading") return; // this is to prevent multiple calls
        setStatus("loading");
        try {
            const result = await cancelNumber(apiKey, accessId);
            if (result.status === "success") {
                setNumber(null);
                setAccessId(null);
                startFetchingNumbers(apiKey);
            } else {
                setError("Failed to cancel the number. Please try again.");
                setStatus("error");
            }
        } catch (err) {
            setError("Failed to cancel the number. Please try again.");
            setStatus("error");
        }
    };

    return { number, accessId, status, error, startFetchingNumbers, handleCancel };
}