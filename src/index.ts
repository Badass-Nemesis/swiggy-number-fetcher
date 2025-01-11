import fetchNumberUntilSuccess from './utils/ninjaotp/fetchNumber';
import cancelNumber from './utils/ninjaotp/cancelNumber';
import fetchMessageCodeUntilSuccess from './utils/ninjaotp/fetchMessageCode';
import fetchNumberDetails from './utils/swiggy/fetchNumberDetails';

async function checkNumberRegistration(phoneNumber: string): Promise<boolean> {
    try {
        const status = await fetchNumberDetails(phoneNumber.slice(2));
        return status?.data?.registered === true;
    } catch (error) {
        console.error('Error checking number registration:', error);
        throw error;
    }
}

async function handleNumber(access_id: string, phoneNumber: string): Promise<void> {
    const isRegistered = await checkNumberRegistration(phoneNumber);

    if (!isRegistered) {
        console.log(`The number (+${phoneNumber}) is not registered. Register and send code now.`);
        console.log('---------------------------------------');
        const code = await fetchMessageCodeUntilSuccess(access_id);
        console.log('Activation code received:', code);
    } else {
        console.log(`The provided number (+${phoneNumber}) is registered.`);
        console.log('---------------------------------------');
        console.log(`Cancelling number +${phoneNumber}`);
        console.log('---------------------------------------');
        await cancelNumber(access_id);
        await main();
    }
}

async function main(): Promise<void> {
    try {
        const { access_id, number: phoneNumber } = await fetchNumberUntilSuccess();
        await handleNumber(access_id, phoneNumber);
    } catch (error) {
        console.error('Error in main function:', error);
        process.exit(1);
    }
}

main();