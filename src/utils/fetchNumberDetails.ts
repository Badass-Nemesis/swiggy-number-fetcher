import { SocksProxyAgent } from 'socks-proxy-agent';
import getCookies from './getCookies';
import getCsrfToken from './getCsrfToken';
import signinWithCheck from './signinWithCheck';

const proxyOptions = `socks5://narendrakumar781:QeeHRkw5TP@122.50.152.150:50101`;
const agent = new SocksProxyAgent(proxyOptions);

export default async function fetchNumberDetails() {
    try {
        console.log('Fetching initial cookies...');
        console.log('---------------------------------------');
        const initialCookies = await getCookies('https://www.swiggy.com/restaurants', agent);
        if (!initialCookies) {
            throw new Error('Failed to fetch initial cookies.');
        }
        console.log('Initial Cookies:', initialCookies);
        console.log('---------------------------------------');

        console.log('Fetching final/combined cookies...');
        console.log('---------------------------------------');
        const { combinedCookies, csrfToken } = await getCsrfToken(agent, initialCookies);
        if (!combinedCookies || !csrfToken) {
            throw new Error('Failed to fetch CSRF token or updated cookies.');
        }
        console.log('Combined Cookies:', combinedCookies);
        console.log('---------------------------------------');
        console.log('CSRF Token:', csrfToken);
        console.log('---------------------------------------');

        console.log('Fetching number details...');
        console.log('---------------------------------------');
        const numberDetails = await signinWithCheck(agent, combinedCookies, csrfToken);
        if (!numberDetails) {
            throw new Error('Failed to fetch number details.');
        }
        console.log('Numbder details: ', numberDetails);
        console.log('---------------------------------------');

        return numberDetails;
    } catch (error) {
        console.error('Error in main flow:', error);
    }
}