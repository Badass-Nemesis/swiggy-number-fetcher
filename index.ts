import axios from 'axios';

async function sendOtpRequest() {
    const url = 'https://www.swiggy.com/dapi/auth/sms-otp';
    const payload = {
        _csrf: 'YiIKKpzE1kab-U_KDROqGA3fTHgolf6AhsTlqRQc',
        mobile: '8252077674',
    };

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
        'Cookie': '__SW=TGWbdanQVv2KfAQZ5aup5vy-bANj8I5D; _device_id=e5489ee8-9f3f-68b3-200b-91c8b403aa50; userLocation={"lat":"26.11920","lng":"85.39630","address":"","area":"","showUserDefaultAddressHint":false}; _ga_34JYJ0BCRN=GS1.1.1728459575.1.1.1728460025.0.0.0; _ga=GA1.1.92298091.1728459575; _guest_tid=eeb33b20-43bb-4d2b-b272-fd6faf0b1bfc; _sid=ib4237d3-264f-412b-8d6a-cf96a1522890; fontsLoaded=1',
        'Sec-Fetch-Dest': 'empty',
        'Sec-Fetch-Mode': 'cors',
        'Sec-Fetch-Site': 'same-origin',
        'Priority': 'u=0',
    };

    try {
        const response = await axios.post(url, payload, { headers });

        console.log('Response:', response.data);
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error('Axios Error:', error.response?.data || error.message);
        } else {
            console.error('Unexpected Error:', error);
        }
    }
}

sendOtpRequest();