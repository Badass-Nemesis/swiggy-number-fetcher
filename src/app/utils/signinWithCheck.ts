import axios from "axios";
import { SocksProxyAgent } from "socks-proxy-agent";
import { PROXY_URL, SWIGGY_BASE_URL, SWIGGY_SIGNIN_CHECK_URL, SWIGGY_RESTAURANTS_URL } from "@/lib/constants";

export async function signinWithCheck(combinedCookies: string, csrfToken: string, phoneNumber: string) {
    try {
        // const agent = new SocksProxyAgent(PROXY_URL);

        const url = `${SWIGGY_SIGNIN_CHECK_URL}`;
        const headers = {
            Host: "www.swiggy.com",
            "User-Agent":
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:134.0) Gecko/20100101 Firefox/134.0",
            Accept: "*/*",
            "Accept-Language": "en-US,en;q=0.5",
            "Accept-Encoding": "gzip, deflate, br, zstd",
            Referer: `${SWIGGY_RESTAURANTS_URL}`,
            "Content-Type": "application/json",
            __fetch_req__: "true",
            Origin: SWIGGY_BASE_URL,
            DNT: "1",
            "Sec-GPC": "1",
            Connection: "keep-alive",
            Cookie: combinedCookies,
            "Sec-Fetch-Dest": "empty",
            "Sec-Fetch-Mode": "cors",
            "Sec-Fetch-Site": "same-origin",
            Priority: "u=4",
            TE: "trailers",
        };

        const payload = {
            mobile: phoneNumber,
            password: "hi",
            _csrf: csrfToken,
        };

        const response = await axios.post(url, payload, {
            // httpAgent: agent,
            // httpsAgent: agent,
            headers,
        });

        return response.data;
    } catch (error) {
        console.error("Error during signin-with-check:", error);
        return null;
    }
}