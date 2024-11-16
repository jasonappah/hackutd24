import { Router } from 'express';
import { uploadFile, listAllFiles } from '../utils/pinata';
import multer from 'multer';
import { v6 as uuidv6 } from 'uuid';

const storage = multer.diskStorage({
    destination: './uploads',
    filename: (req, file, cb) => cb(null, `${uuidv6()}.${file.originalname.split('.').pop()}`),
});
const upload = multer({ storage });

const index = Router();

index.post('/image', upload.single('image'), async (req, res) => {
    const image = req.file;

    if (!image) {
        res.status(400).json({ success: false, error: 'No image provided' });
        return;
    }


    // TODO: validate image using file-type
    if (!image.mimetype.startsWith('image/')) {
        res.status(400).json({ success: false, error: 'File is not an image' });
        return;
    }

    await uploadFile(image);
    res.json({ success: true, error: null });
});

index.get('/all-images', async (req, res) => {
    const allFiles = await listAllFiles();

    res.json({ success: true, error: null, data: allFiles });
});

export default index;