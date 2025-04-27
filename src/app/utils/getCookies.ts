import axios from "axios";
import { SocksProxyAgent } from "socks-proxy-agent";
import { PROXY_URL, SWIGGY_RESTAURANTS_URL } from "@/app/lib/constants";

export async function getCookies() {
    try {
        // const agent = new SocksProxyAgent(PROXY_URL);

        const response = await axios.get(`${SWIGGY_RESTAURANTS_URL}`, {
            // httpAgent: agent,
            // httpsAgent: agent,
            headers: {
                "User-Agent":
                    "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:134.0) Gecko/20100101 Firefox/134.0",
                Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
                "Accept-Language": "en-US,en;q=0.5",
                "Accept-Encoding": "gzip, deflate, br, zstd",
                DNT: "1",
                "Sec-GPC": "1",
                Connection: "keep-alive",
                "Upgrade-Insecure-Requests": "1",
                "Sec-Fetch-Dest": "document",
                "Sec-Fetch-Mode": "navigate",
                "Sec-Fetch-Site": "none",
                "Sec-Fetch-User": "?1",
                Priority: "u=0, i",
            },
        });

        const cookies = response.headers["set-cookie"];
        if (cookies) {
            return cookies.join("; ");
        } else {
            return null;
        }
    } catch (error) {
        console.error("Error fetching cookies:", error);
        return null;
    }
}