import 'dotenv/config';
import { z } from 'zod';

// Schema to define Config
const schema = z.object({
    PINATA_JWT: z.string({ required_error: 'PINATA_JWT is required' }),
    PINATA_GATEWAY_URL: z.string({ required_error: 'PINATA_GATEWAY_URL is required' }),
    OLLAMA_ENDPOINT_URL: z.string({ required_error: 'OLLAMA_ENDPOINT_URL is required' }).url(),
    PINATA_PUBLIC_GROUP_ID: z.string({ required_error: 'PINATA_PUBLIC_GROUP_ID is required' }),
    SAMBA_NOVA_API_KEY: z.string({ required_error: 'SAMBA_NOVA_API_KEY is required' }),
});

type ConfigType = z.infer<typeof schema>;

// Ensure that process.env is valid
const envConfig: ConfigType = schema.parse(process.env);

export { envConfig };