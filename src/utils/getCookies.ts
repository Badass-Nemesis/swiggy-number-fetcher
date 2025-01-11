import axios from 'axios';
import { SocksProxyAgent } from 'socks-proxy-agent';

async function getCookies(url: string) {
    try {
        const proxyOptions = `socks5://narendrakumar781:QeeHRkw5TP@122.50.152.150:50101`;
        const agent = new SocksProxyAgent(proxyOptions);

        const response = await axios.get(url, {
            httpAgent: agent,
            httpsAgent: agent,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:134.0) Gecko/20100101 Firefox/134.0',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
                'Accept-Language': 'en-US,en;q=0.5',
                'Accept-Encoding': 'gzip, deflate, br, zstd',
                'DNT': '1',
                'Sec-GPC': '1',
                'Connection': 'keep-alive',
                'Upgrade-Insecure-Requests': '1',
                'Sec-Fetch-Dest': 'document',
                'Sec-Fetch-Mode': 'navigate',
                'Sec-Fetch-Site': 'none',
                'Sec-Fetch-User': '?1',
                'Priority': 'u=0, i',
            },
        });

        const cookies = response.headers['set-cookie'];
        if (cookies) {
            console.log('Cookies received:');
            cookies.forEach((cookie: string, index: number) => {
                console.log(`Cookie ${index + 1}: ${cookie}`);
            });
            return cookies.join('; ');
        } else {
            console.log('No cookies found in the response.');
            return '';
        }
    } catch (error) {
        console.error('Error fetching cookies:', error);
        return '';
    }
}

export default getCookies;