import axios from 'axios';
import { SocksProxyAgent } from 'socks-proxy-agent';
import getCsrfToken from './getCsrfToken';

async function signinWithCheck() {
    try {
        const { combinedCookies, csrfToken } = await getCsrfToken();
        if (!combinedCookies || !csrfToken) {
            throw new Error('Failed to fetch cookies or CSRF token.');
        }

        const proxyOptions = `socks5://narendrakumar781:QeeHRkw5TP@122.50.152.150:50101`; 
        const agent = new SocksProxyAgent(proxyOptions);

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

        const data = {
            mobile: '8252077673', 
            password: 'yes', 
            _csrf: csrfToken, 
        };

        const response = await axios.post(url, data, {
            httpAgent: agent,
            httpsAgent: agent,
            headers,
        });

        console.log('Response Data:', response.data);
    } catch (error) {
        console.error('Error during signin-with-check:', error);
    }
}

signinWithCheck();