import axios from "axios";
import { SocksProxyAgent } from "socks-proxy-agent";
import { PROXY_URL, SWIGGY_BASE_URL, SWIGGY_RESTAURANTS_URL } from "@/app/lib/constants";

export async function getCsrfToken(initialCookies: string) {
  try {
    // const agent = new SocksProxyAgent(PROXY_URL);

    const url = `${SWIGGY_BASE_URL}/dapi/restaurants/list/v5?lat=25.68850&lng=85.21160&is-seo-homepage-enabled=true&page_type=DESKTOP_WEB_LISTING`;
    const headers = {
      Host: "www.swiggy.com",
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:134.0) Gecko/20100101 Firefox/134.0",
      Accept: "*/*",
      "Accept-Language": "en-US,en;q=0.5",
      "Accept-Encoding": "gzip, deflate, br, zstd",
      Referer: SWIGGY_RESTAURANTS_URL,
      __fetch_req__: "true",
      "content-type": "application/json",
      DNT: "1",
      "Sec-GPC": "1",
      Connection: "keep-alive",
      Cookie: initialCookies,
      "Sec-Fetch-Dest": "empty",
      "Sec-Fetch-Mode": "cors",
      "Sec-Fetch-Site": "same-origin",
      Priority: "u=4",
      TE: "trailers",
    };

    const response = await axios.get(url, {
      // httpAgent: agent,
      // httpsAgent: agent,
      headers,
    });

    const updatedCookies = response.headers["set-cookie"] || [];
    const csrfToken = response.data?.csrfToken;

    const combinedCookies = `${initialCookies}; ${updatedCookies.join("; ")}`;

    return { combinedCookies, csrfToken };
  } catch (error) {
    console.error("Error fetching CSRF token:", error);
    return { combinedCookies: null, csrfToken: null };
  }
}