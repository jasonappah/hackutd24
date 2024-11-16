import { PinataSDK } from 'pinata';
import 'dotenv/config';
import { faker } from '@faker-js/faker/locale/en';
import { v6 as uuidv6 } from 'uuid';

const pinata = new PinataSDK({
    pinataGateway: process.env.PINATA_GATEWAY,
    pinataJwt: process.env.PINATA_JWT
});

const uploadFile = async (file: Express.Multer.File) => {
    const uuid = uuidv6();
    const originalExtension = file.originalname.split('.').pop();

    const fileToUpload = new File([file.buffer], `${uuid}.${originalExtension}` , { type: file.mimetype });
    const uploadedFile = await pinata.upload.file(fileToUpload, {
        metadata: {
            keyvalues: {
                driverName: faker.person.fullName(),
                passengerName: faker.person.fullName(),
                timestamp: new Date().toUTCString()
            }
        }
    });

    return uploadedFile;
};

const listAllFiles = async () => {
    const allFiles = await pinata.files.list().order('DESC');
    return allFiles;
};


export { uploadFile, listAllFiles };