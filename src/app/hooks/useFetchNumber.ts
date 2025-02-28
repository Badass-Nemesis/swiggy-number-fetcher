import { useState } from "react";
import { fetchNumber } from "@/app/utils/fetchNumber";
import { cancelNumber } from "@/app/utils/cancelNumber";
import { fetchService } from "@/app/utils/fetchService";

export function useFetchNumber() {
    const [number, setNumber] = useState<string | null>(null);
    const [accessId, setAccessId] = useState<string | null>(null);
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
    const [message, setMessage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [serverId, setServerId] = useState<number>(2); // the default server is 2
    const [service, setService] = useState<string | null>(null);

    const startFetchingNumbers = async (apiKey: string) => {
        if (status === "loading") return; // prevent multiple calls
        setStatus("loading");

        try {
            setMessage("Fetching the service data first...");
            const serviceResult = await fetchService(apiKey, serverId);
            if (serviceResult.status === "success" && serviceResult.swiggyId) {
                setService(serviceResult.swiggyId);
            } else {
                setError("Failed to fetch the service. Please try again.");
                setStatus("error");
                return;
            }

            if (!serviceResult.swiggyId) {
                setError("Service is not available. Please try again.");
                setStatus("error");
                return;
            }

            while (true) {
                try {
                    setMessage("Fetching a number...");
                    const result = await fetchNumber(apiKey, serverId, serviceResult.swiggyId);
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
        } catch (err) {
            if (err instanceof Error) {
                setError(`Failed to fetch service. Error: ${err.message}`);
            } else {
                setError("Failed to fetch service. Please try again.");
            }
            setStatus("error");
        }
    };

    const handleCancel = async (apiKey: string, accessId: string) => {
        if (status === "loading") return; // prevent multiple calls
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

    return { number, accessId, status, error, serverId, setServerId, message, service, setService, startFetchingNumbers, handleCancel };
}