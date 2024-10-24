const express = require('express');
const mongoose = require('mongoose');
const Minio = require('minio');
const multer = require('multer');
require('dotenv').config();
const axios = require('axios');
const fs = require('fs');
const cors = require('cors');
const Image = require('./models/Image');


const app = express();
app.use(express.json());


const storage = multer.memoryStorage();
const upload = multer({ storage });


mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB connected"))
    .catch(err => console.log(err));


const minioClient = new Minio.Client({
    endPoint: process.env.MINIO_ENDPOINT,
    port: parseInt(process.env.MINIO_PORT),
    useSSL: false,
    accessKey: process.env.MINIO_ROOT_USER,
    secretKey: process.env.MINIO_ROOT_PASSWORD,
});


minioClient.bucketExists(process.env.MINIO_BUCKET, (err) => {
    if (err) {
        minioClient.makeBucket(process.env.MINIO_BUCKET, '', (err) => {
            if (err) console.log('Error creating bucket.', err);
            else console.log('Bucket created successfully');
        });
    } else {
        console.log('Bucket already exists');
    }
});
app.post('/search', async (req, res) => {
    const { prompt } = req.body;
    if (!prompt) {
        return res.status(400).send('Prompt is required.');
    }


    try {
        const images = await Image.find({}, 'llmResponse url');


        const responses = images.map((image, index) => `${index}. ${image.llmResponse}`);
       
        const formattedResponses = responses.join('\n\n');

        const ollamaResponse = await axios.post('http://localhost:11434/api/chat', {
            model: "llama3.2",
            "messages": [
                {
                    "role": "user",
                    "content": `Based on the following numbered descriptions, which one best matches this prompt: "${prompt}"? Only return the best-fit index number.\n\nDescriptions:\n\n${formattedResponses}`
                }
            ],
            "stream": false
        });

        console.log('Ollama Response:', JSON.stringify(ollamaResponse.data, null, 2));


        // Extract the matched index from Ollama's message content
        const matchedIndex = parseInt(ollamaResponse.data.message.content.trim());


        // Retrieve the corresponding URL based on the index
        const bestFitImage = images[matchedIndex];


        if (bestFitImage) {
            res.status(200).json({ imageUrl: bestFitImage.url });
        } else {
            res.status(404).json({ message: 'No matching image found.' });
        }
    } catch (error) {
        console.error('Error searching for image:', error);
        res.status(500).send('Error searching for image.');
    }
});




app.post('/upload', upload.single('image'), async (req, res) => {
    const { description, album } = req.body;
    if (!description || !req.file) {
        return res.status(400).send('Description and image are required.');
    }


    const fileName = `${Date.now()}_${req.file.originalname}`;
    minioClient.putObject(process.env.MINIO_BUCKET, fileName, req.file.buffer, req.file.size, async (err) => {
        if (err) {
            return res.status(500).send('Error uploading image to MinIO.');
        }


        const imageUrl = `http://localhost:9000/${process.env.MINIO_BUCKET}/${fileName}`;
        const imagePath = fileName;


        try {
            const response = await axios({
                method: 'get',
                url: imageUrl,
                responseType: 'stream',
            });


            const writer = fs.createWriteStream(imagePath);
            response.data.pipe(writer);


            writer.on('finish', async () => {
                const imgPath = `/Users/md.sabbirhosen/Desktop/projects/voyage/backend2/${fileName}`;
                const imageBuffer = fs.readFileSync(imgPath);
                const imageBase64 = imageBuffer.toString('base64');
            });


            writer.on('error', (error) => {
                console.error('Error writing file:', error);
                res.status(500).send('Error saving the image locally.');
            });
        } catch (error) {
            console.error('Error fetching image:', error);
            res.status(500).send('Error downloading image from MinIO.');
        }
    });
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
