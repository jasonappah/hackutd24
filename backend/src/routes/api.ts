import { Router } from 'express';
import { listAllFiles, uploadFileBase64 } from '../pinata';
import axios from 'axios';
import { envConfig } from '../config';
import { prompt } from '../aiPrompt';
import PQueue from 'p-queue';
import { readFileSync } from 'fs';
import { pushNotifcation } from '../pushNotification';

const q = new PQueue({ concurrency: 3 });

const index = Router();

index.post('/imageb64', async (req, res) => {
    console.log('Processing image...');
    const {image} = req.body;

    if (!image) {
        res.status(400).json({ success: false, error: 'No image provided' });
        return;
    }

    res.sendStatus(201);

    // writeFileSync('./test.jpg', Buffer.from(image, 'base64'));


    q.add(async () => {
        try {
            // const baselineImageExist = existsSync('./baseline.jpg');
            // const response = await axios.post(`${envConfig.OLLAMA_ENDPOINT_URL}/api/generate`, {
            //     model: 'llama3.2-vision',
            //     prompt,
            //     stream: false,
            //     temperature: 0.3,
            //     top_p: 0.8,
            //     images: [image]
            // });

            const messages = [
                {
                    role: 'user',
                    content: [
                        {
                            type: 'text',
                            text: 'Your are an AI Assistant the helps you find items that a customer might forget in a car. The image included is baseline image where no items are present.'
                        },
                        {
                            type: 'image_url',
                            image_url: {
                                url: `data:image/jpeg;base64,${readFileSync('./baseline.jpg').toString('base64')}`
                            }
                        }
                    ]
                },
                {
                    role: 'user',
                    content: [
                        {
                            type: 'image_url',
                            image_url: {
                                url: `data:image/jpeg;base64,${image}`
                            }
                        },
                        {
                            type: 'text',
                            text: prompt
                        },
                    ]
                }
            ];

            
            const response = await axios.post('https://api.sambanova.ai/v1/chat/completions', {
                model: 'Llama-3.2-11B-Vision-Instruct',
                stream: false,
                temperature: 0.3,
                top_p: 0.8,
                max_tokens: 180,
                messages
            }, {
                headers: {
                    Authorization: `Bearer ${envConfig.SAMBA_NOVA_API_KEY}`
                }
            });

            const responseText = response.data.choices[0].message.content;

            console.log(responseText);

            if (responseText.toLowerCase() != 'none') {
                const uploadedFile = await uploadFileBase64(image, responseText);
                await pushNotifcation(responseText, uploadedFile.cid);
            }
            console.log('Process image done!');
        } catch (error) {
            console.error(error);
            return;
        }
    });
});

index.get('/all-images', async (req, res) => {
    const allFiles = await listAllFiles();

    res.json({ success: true, error: null, data: allFiles });
});

export default index;