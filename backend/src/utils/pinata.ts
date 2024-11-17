import { PinataSDK } from 'pinata';
import 'dotenv/config';
import { faker } from '@faker-js/faker/locale/en';
import { readFileSync } from 'fs';
import { envConfig } from '../config';
import { v6 as uuidv6 } from 'uuid';

const pinata = new PinataSDK({
    pinataGateway: envConfig.PINATA_GATEWAY,
    pinataJwt: envConfig.PINATA_JWT
});

pinata.testAuthentication()
    .then(() => console.log('Connected to Pinata!'))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });

const generateTestMetadata = (): Record<string, string> => ({
    driverName: faker.person.fullName(),
    passengerName: faker.person.fullName(),
    timestamp: new Date().toUTCString()
});

const uploadFile = async (file: Express.Multer.File) => {
    const fileToUpload = new File([readFileSync(file.path)], file.filename , { type: file.mimetype });
    return await pinata.upload.file(fileToUpload, {
        metadata: {
            keyvalues: generateTestMetadata()
        }
    }).group(envConfig.PINATA_PUBLIC_GROUP_ID);
};

const uploadFileBase64 = async (base64: string, description: string) => {
    const fileToUpload = new File([Buffer.from(base64, 'base64')], `${uuidv6()}.jpeg`, { type: 'image/jpeg' });
    return await pinata.upload.file(fileToUpload, {
        metadata: {
            keyvalues: {
                ...generateTestMetadata(),
                description
            }
        }
    }).group(envConfig.PINATA_PUBLIC_GROUP_ID);
};

const createPublicGroup = async () => {
    return await pinata.groups.create({
        name: 'public',
        isPublic: true
    });
};

const listAllGroups = async () => await pinata.groups.list();

const listAllFiles = async () => await pinata.files.list().group(envConfig.PINATA_PUBLIC_GROUP_ID).order('DESC').limit(10);


export { uploadFile, listAllFiles, createPublicGroup, listAllGroups, uploadFileBase64 };