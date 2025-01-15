"use server";

import axios from "axios";
import { SocksProxyAgent } from "socks-proxy-agent";
import { API_KEY, PROXY_URL } from "@/lib/constants";

export async function fetchNumber() {
    try {
        const agent = new SocksProxyAgent(PROXY_URL);
        const API_URL = `https://api.ninjaotp.com/stubs/handler_api.php?api_key=${API_KEY}&action=getNumber&service=jx&country=22&server_id=2`;

        const response = await axios.get(API_URL, {
            httpAgent: agent,
            httpsAgent: agent,
        });

        const data = response.data;

        if (data === "NO_NUMBERS") {
            console.log("No numbers available. Retrying...");
            throw new Error("NO_NUMBERS");
        } else if (data.startsWith("ACCESS_NUMBER:")) {
            const [_, access_id, number] = data.split(":");
            console.log("Number fetched successfully:", { access_id, number });
            return { access_id, number };
        } else {
            throw new Error(data);
        }
    } catch (error) {
        console.error("Error fetching number:", error);
        throw error;
    }
}