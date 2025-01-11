import axios from 'axios';

async function getCookies(url: string) {
    try {
        const response = await axios.get(url, {
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
        } else {
            console.log('No cookies found in the response.');
        }
    } catch (error) {
        console.error('Error fetching cookies:', error);
    }
}

const url = 'https://www.swiggy.com/restaurants';
getCookies(url);