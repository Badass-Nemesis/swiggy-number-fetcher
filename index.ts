import axios from 'axios';
import * as cheerio from 'cheerio';

const SWIGGY_HOMEPAGE_URL = 'https://www.swiggy.com/';

const SWIGGY_API_URL = 'https://www.swiggy.com/dapi/auth/sms-otp';

const COOKIES = '__SW=TGWbdanQVv2KfAQZ5aup5vy-bANj8I5D; _device_id=e5489ee8-9f3f-68b3-200b-91c8b403aa50; _ga=GA1.1.92298091.1728459575; _ga_34JYJ0BCRN=GS1.1.1728459575.1.1.1728460025.0.0.0; _guest_tid=eeb33b20-43bb-4d2b-b272-fd6faf0b1bfc; _sid=ib4237d3-264f-412b-8d6a-cf96a1522890; fontsLoaded=1; userLocation={"lat":"26.11920","lng":"85.39630","address":"","area":"","showUserDefaultAddressHint":false}';

const HEADERS = {
    'Content-Type': 'application/json',
    'Cookie': COOKIES,
    'Referer': 'https://www.swiggy.com/restaurants',
    'Origin': 'https://www.swiggy.com',
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:134.0) Gecko/20100101 Firefox/134.0',
};

async function fetchCsrfToken(): Promise<string> {
    try {
        const response = await axios.get(SWIGGY_HOMEPAGE_URL, {
            headers: {
                'Cookie': COOKIES,
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:134.0) Gecko/20100101 Firefox/134.0',
            },
        });

        const $ = cheerio.load(response.data);

        const csrfToken = $('meta[name="csrf-token"]').attr('content');

        if (!csrfToken) {
            throw new Error('CSRF token not found in the HTML');
        }

        return csrfToken;
    } catch (error) {
        console.error('Error fetching CSRF token:', error);
        throw error;
    }
}

async function callSwiggyApi(mobile: string) {
    try {
        const csrfToken = await fetchCsrfToken();
        console.log('Fetched CSRF Token:', csrfToken);

        const payload = {
            mobile: mobile,
            _csrf: csrfToken,
        };

        const response = await axios.post(SWIGGY_API_URL, payload, { headers: HEADERS });

        console.log('API Response:', response.data);
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error('API Error:', error.response?.data || error.message);
        } else {
            console.error('Unexpected Error:', error);
        }
    }
}

const mobileNumber = '8252077672'; 
callSwiggyApi(mobileNumber);