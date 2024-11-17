import { PinataSDK } from 'pinata';
import 'dotenv/config';
import { faker } from '@faker-js/faker/locale/en';
import { readFileSync } from 'fs';

const pinata = new PinataSDK({
    pinataGateway: process.env.PINATA_GATEWAY,
    pinataJwt: process.env.PINATA_JWT
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
    }).group(process.env.PINATA_PUBLIC_GROUP_ID as string);
};

const createPublicGroup = async () => {
    return await pinata.groups.create({
        name: 'public',
        isPublic: true
    });
};

const listAllGroups = async () => await pinata.groups.list();

const listAllFiles = async () => await pinata.files.list().group(process.env.PINATA_PUBLIC_GROUP_ID as string).order('DESC').limit(10);


export { uploadFile, listAllFiles, createPublicGroup, listAllGroups };