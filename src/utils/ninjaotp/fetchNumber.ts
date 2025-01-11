import axios from 'axios';

const API_KEY = 'eb1342c66acf388ddcc87659d52dac912c09';
const SERVICE = 'jx';
const COUNTRY = 22;
const SERVER_ID = 2;
const RETRY_DELAY = 3000;

const API_URL = `https://api.ninjaotp.com/stubs/handler_api.php?api_key=${API_KEY}&action=getNumber&service=${SERVICE}&country=${COUNTRY}&server_id=${SERVER_ID}`;

async function fetchNumber(): Promise<{ access_id: string; number: string }> {
    try {
        const response = await axios.get(API_URL);
        const data = response.data;

        switch (data) {
            case 'NO_NUMBERS':
                console.log(`No numbers available. Retrying in ${(RETRY_DELAY / 1000).toFixed(1)} seconds...`);
                throw new Error('NO_NUMBERS');

            case 'BAD_SERVICE':
                throw new Error('Incorrect service ID.');

            case 'BAD_SERVER':
                throw new Error('Incorrect server ID.');

            case 'BAD_COUNTRY':
                throw new Error('Incorrect country ID.');

            case 'NO_BALANCE':
                throw new Error('Insufficient balance.');

            case 'ERROR':
                throw new Error('An error occurred.');

            default:
                const [somestring, access_id, number] = data.split(':');
                if (!access_id || !number) {
                    throw new Error('Invalid response format.');
                }
                console.log('Number fetched successfully:', { access_id, number });
                console.log('---------------------------------------');
                return { access_id, number };
        }
    } catch (error) {
        if (error instanceof Error && error.message !== 'NO_NUMBERS') {
            console.error('Error fetching activation code:', error);
        }
        throw error;
    }
}

export default async function fetchNumberUntilSuccess(): Promise<{ access_id: string; number: string }> {
    while (true) {
        try {
            const result = await fetchNumber();
            return result;
        } catch (error) {
            if (error instanceof Error && error.message === 'NO_NUMBERS') {
                await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY));
            } else {
                throw error;
            }
        }
    }
}