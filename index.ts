import axios from 'axios';

const SWIGGY_API_URL = 'https://www.swiggy.com/dapi/auth/sms-otp'; 

const payload = {
    mobile: '8252077672',
    _csrf: 'ldUNd4alneeJ-EPxR6lqU7366oWMKNBb0ZZdW66A',
};

const headers = {
    'Content-Type': 'application/json',
};

async function callSwiggyApi() {
    try {
        const response = await axios.post(SWIGGY_API_URL, payload, { headers });

        console.log('API Response:', response.data);
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error('API Error:', error.response?.data || error.message);
        } else {
            console.error('Unexpected Error:', error);
        }
    }
}

callSwiggyApi();