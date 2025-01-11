import axios from 'axios';

const API_KEY = 'eb1342c66acf388ddcc87659d52dac912c09';
const RETRY_DELAY = 5000;

async function fetchMessageCode(activationId: string): Promise<string> {
    try {
        const API_URL = `https://api.ninjaotp.com/stubs/handler_api.php?api_key=${API_KEY}&action=getStatus&id=${activationId}`;
        const response = await axios.get(API_URL);
        const data = response.data;

        switch (data) {
            case data.startsWith('STATUS_OK:') ? data : '':
                const code = data.split(':')[1];
                console.log('Activation code received:', code);
                return code;

            case 'STATUS_WAIT_CODE':
                console.log(`Waiting for SMS. Retrying in ${(RETRY_DELAY / 1000).toFixed(1)} seconds...`);
                throw new Error('STATUS_WAIT_CODE');

            case 'STATUS_CANCEL':
                throw new Error('Activation canceled.');

            case 'ERROR':
                throw new Error('An error occurred.');

            default:
                throw new Error('Unknown response from server.');
        }
    } catch (error) {
        if (error instanceof Error && error.message !== 'STATUS_WAIT_CODE') {
            console.error('Error fetching activation code:', error);
        }
        throw error;
    }
}

export default async function fetchMessageCodeUntilSuccess(activationId: string): Promise<string> {
    while (true) {
        try {
            const code = await fetchMessageCode(activationId);
            return code;
        } catch (error) {
            if (error instanceof Error && error.message === 'STATUS_WAIT_CODE') {
                await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY));
            } else {
                throw error;
            }
        }
    }
}