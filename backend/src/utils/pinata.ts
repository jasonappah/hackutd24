import { PinataSDK } from 'pinata';
import 'dotenv/config';
import { faker } from '@faker-js/faker/locale/en';

const pinata = new PinataSDK({
    pinataGateway: process.env.PINATA_GATEWAY,
    pinataJwt: process.env.PINATA_JWT
});

const generateTestMetadata = (): Record<string, string> => ({
    driverName: faker.person.fullName(),
    passengerName: faker.person.fullName(),
    timestamp: new Date().toUTCString()
});

const uploadFile = async (file: Express.Multer.File) => {
    const fileToUpload = new File([file.buffer], file.filename , { type: file.mimetype });
    return await pinata.upload.file(fileToUpload, {
        metadata: {
            keyvalues: generateTestMetadata()
        }
    });
};

const listAllFiles = async () => await pinata.files.list().order('DESC');


export { uploadFile, listAllFiles };