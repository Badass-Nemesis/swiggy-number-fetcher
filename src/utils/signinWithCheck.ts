import axios from 'axios';
import { SocksProxyAgent } from 'socks-proxy-agent';

async function signinWithCheck(agent: SocksProxyAgent, combinedCookies: string, csrfToken: string) {
    try {
        const url = 'https://www.swiggy.com/dapi/auth/signin-with-check';
        const headers = {
            'Host': 'www.swiggy.com',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:134.0) Gecko/20100101 Firefox/134.0',
            'Accept': '*/*',
            'Accept-Language': 'en-US,en;q=0.5',
            'Accept-Encoding': 'gzip, deflate, br, zstd',
            'Referer': 'https://www.swiggy.com/restaurants',
            'Content-Type': 'application/json',
            '__fetch_req__': 'true',
            'Origin': 'https://www.swiggy.com',
            'DNT': '1',
            'Sec-GPC': '1',
            'Connection': 'keep-alive',
            'Cookie': combinedCookies,
            'Sec-Fetch-Dest': 'empty',
            'Sec-Fetch-Mode': 'cors',
            'Sec-Fetch-Site': 'same-origin',
            'Priority': 'u=4',
            'TE': 'trailers',
        };

        const payload = {
            mobile: '8252077673',
            password: 'hi',
            _csrf: csrfToken,
        };

        const response = await axios.post(url, payload, {
            httpAgent: agent,
            httpsAgent: agent,
            headers,
        });

        // console.log('Response Data:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error during signin-with-check:', error);
    }
}

export default signinWithCheck;