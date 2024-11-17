import axios, { AxiosError } from 'axios';
import { envConfig } from '../config';

const client = axios.create({
    baseURL: envConfig.NTFY_URL,
    headers: {
        Authorization: `Bearer ${envConfig.NTFY_TOKEN}`,
        Title: 'Backtracc Notification',
        Priority: 'urgent',
        Tags: 'warning',
    }
});

const pushNotifcation = async (message: string, imageCID: string) => {
    try {
        await client.post(`/${envConfig.NTFY_TOPIC_NAME}`, message, {
            headers: {
                Attach: `https://${envConfig.PINATA_GATEWAY}/files/${imageCID}?img-width=500&img-fit=scale-down`
            }
        });
    } catch (error) {
        if (axios.isAxiosError(error)) {
            const axiosError = error as AxiosError;
            console.error(axiosError);
        }
    }
};

export { pushNotifcation };

