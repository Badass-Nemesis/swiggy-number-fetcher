"use server";

import axios from "axios";
import { SocksProxyAgent } from "socks-proxy-agent";
import { API_KEY, PROXY_URL } from "@/lib/constants";

export async function cancelNumber(access_id: string) {
    try {
        const agent = new SocksProxyAgent(PROXY_URL);
        const API_URL = `https://api.ninjaotp.com/stubs/handler_api.php?api_key=${API_KEY}&action=setStatus&status=cancel&id=${access_id}`;

        const response = await axios.get(API_URL, {
            httpAgent: agent,
            httpsAgent: agent,
        });

        const data = response.data;

        switch (data) {
            case "ACCESS_CANCEL":
                console.log("Number canceled successfully.");
                return true;
            case "ERROR":
                throw new Error("An error occurred while canceling the number.");
            default:
                throw new Error("Unknown response from server.");
        }
    } catch (error) {
        console.error("Error canceling number:", error);
        return false;
    }
}