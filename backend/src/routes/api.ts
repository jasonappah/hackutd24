import { Router } from 'express';
import { listAllFiles, uploadFileBase64 } from '../utils/pinata';
import axios from 'axios';
import { envConfig } from '../config';
import { prompt } from '../aiPrompt';
import PQueue from 'p-queue';

const q = new PQueue({ concurrency: 1 });

const index = Router();

index.post('/imageb64', async (req, res) => {
    const image = req.body.image;

    if (!image) {
        res.status(400).json({ success: false, error: 'No image provided' });
        return;
    }

    res.sendStatus(201);

    q.add(async () => {
        try {
            const response = await axios.post(`${envConfig.OLLAMA_ENDPOINT_URL}/api/generate`, {
                model: 'llama3.2-vision',
                prompt,
                stream: false,
                temperature: 0.3,
                top_p: 0.8,
                images: [image]
            });

            console.log(response.data.response);

            await uploadFileBase64(image, response.data.response);
            
            console.log('Process image done!');
        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, error: 'Error processing image' });
            return;
        }
    });
});

index.get('/all-images', async (req, res) => {
    const allFiles = await listAllFiles();

    res.json({ success: true, error: null, data: allFiles });
});

export default index;