"use server";

import axios from "axios";
import { SocksProxyAgent } from "socks-proxy-agent";
import { API_KEY, PROXY_URL } from "@/lib/constants";

const RETRY_DELAY = 5000; // 5 seconds

export async function fetchMessageCode(activationId: string) {
    try {
        const agent = new SocksProxyAgent(PROXY_URL);
        const API_URL = `https://api.ninjaotp.com/stubs/handler_api.php?api_key=${API_KEY}&action=getStatus&id=${activationId}`;

        const response = await axios.get(API_URL, {
            httpAgent: agent,
            httpsAgent: agent,
        });

        const data = response.data;

        if (data.startsWith("STATUS_OK:")) {
            const code = data.split(":")[1];
            console.log("Activation code received:", code);
            return code;
        } else if (data === "STATUS_WAIT_CODE") {
            console.log(`Waiting for SMS. Retrying in ${RETRY_DELAY / 1000} seconds...`);
            throw new Error("STATUS_WAIT_CODE");
        } else if (data === "STATUS_CANCEL") {
            throw new Error("Activation canceled.");
        } else if (data === "ERROR") {
            throw new Error("An error occurred.");
        } else {
            throw new Error("Unknown response from server.");
        }
    } catch (error) {
        if (error instanceof Error && error.message !== "STATUS_WAIT_CODE") {
            console.error("Error fetching activation code:", error);
        }
        throw error;
    }
}