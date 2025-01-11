import axios from 'axios';
import { SocksProxyAgent } from 'socks-proxy-agent';
import getCookies from './getCookies';

async function getCsrfToken() {
    try {
        const initialCookies = await getCookies('https://www.swiggy.com/restaurants');
        if (!initialCookies) {
            throw new Error('Failed to fetch initial cookies.');
        }

        const proxyOptions = `socks5://narendrakumar781:QeeHRkw5TP@122.50.152.150:50101`; 
        const agent = new SocksProxyAgent(proxyOptions);

        const url = 'https://www.swiggy.com/dapi/restaurants/list/v5?lat=25.68850&lng=85.21160&is-seo-homepage-enabled=true&page_type=DESKTOP_WEB_LISTING';
        const headers = {
            'Host': 'www.swiggy.com',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:134.0) Gecko/20100101 Firefox/134.0',
            'Accept': '*/*',
            'Accept-Language': 'en-US,en;q=0.5',
            'Accept-Encoding': 'gzip, deflate, br, zstd',
            'Referer': 'https://www.swiggy.com/restaurants',
            '__fetch_req__': 'true',
            'content-type': 'application/json',
            'DNT': '1',
            'Sec-GPC': '1',
            'Connection': 'keep-alive',
            'Cookie': initialCookies, 
            'Sec-Fetch-Dest': 'empty',
            'Sec-Fetch-Mode': 'cors',
            'Sec-Fetch-Site': 'same-origin',
            'Priority': 'u=4',
            'TE': 'trailers',
        };

        const response = await axios.get(url, {
            httpAgent: agent,
            httpsAgent: agent,
            headers,
        });

        const updatedCookies = response.headers['set-cookie'] || [];
        const csrfToken = response.data?.csrfToken;

        const combinedCookies = `${initialCookies}; ${updatedCookies.join('; ')}`;

        if (updatedCookies.length > 0) {
            console.log('Updated Cookies:');
            updatedCookies.forEach((cookie: string, index: number) => {
                console.log(`Cookie ${index + 1}: ${cookie}`);
            });
        } else {
            console.log('No updated cookies found.');
        }

        if (csrfToken) {
            console.log('CSRF Token:', csrfToken);
        } else {
            console.log('No CSRF token found in the response.');
        }

        return {
            combinedCookies,
            csrfToken,
        };
    } catch (error) {
        console.error('Error fetching CSRF token:', error);
        return {
            combinedCookies: '',
            csrfToken: '',
        };
    }
}

export default getCsrfToken;