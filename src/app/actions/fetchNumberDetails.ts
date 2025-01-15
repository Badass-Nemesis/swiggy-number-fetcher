"use server";

import { SocksProxyAgent } from "socks-proxy-agent";
import { PROXY_URL, SWIGGY_BASE_URL } from "@/lib/constants";
import { getCookies } from "@/app/utils/getCookies";
import { getCsrfToken } from "@/app/utils/getCsrfToken";
import { signinWithCheck } from "@/app/utils/signinWithCheck";

export async function fetchNumberDetails(phoneNumber: string) {
    try {
        const agent = new SocksProxyAgent(PROXY_URL);

        console.log("Fetching initial cookies...");
        const initialCookies = await getCookies(`${SWIGGY_BASE_URL}/restaurants`, agent);
        if (!initialCookies) {
            throw new Error("Failed to fetch initial cookies.");
        }

        console.log("Fetching CSRF token and updated cookies...");
        const { combinedCookies, csrfToken } = await getCsrfToken(agent, initialCookies);
        if (!combinedCookies || !csrfToken) {
            throw new Error("Failed to fetch CSRF token or updated cookies.");
        }

        console.log(`Fetching number details for ${phoneNumber}...`);
        const numberDetails = await signinWithCheck(combinedCookies, csrfToken, phoneNumber);
        if (!numberDetails) {
            throw new Error("Failed to fetch number details.");
        }

        return numberDetails;
    } catch (error) {
        console.error("Error fetching number details:", error);
        throw error;
    }
}