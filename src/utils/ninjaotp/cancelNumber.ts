import axios from 'axios';

const API_KEY = 'eb1342c66acf388ddcc87659d52dac912c09';

async function cancelNumber(access_id: string): Promise<boolean> {
    try {
        const API_URL = `https://api.ninjaotp.com/stubs/handler_api.php?api_key=${API_KEY}&action=setStatus&status=cancel&id=${access_id}`;

        const response = await axios.get(API_URL);
        const data = response.data;

        switch (data) {
            case 'ACCESS_CANCEL':
                console.log('Number canceled successfully.');
                console.log('---------------------------------------');
                return true;
            case 'ERROR':
                throw new Error('An error occurred while canceling the number.');
            default:
                throw new Error('Unknown response from server.');
        }
    } catch (error) {
        console.error('Error canceling number:', error);
        return false;
    }
}

export default cancelNumber;