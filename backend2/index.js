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
app.use(cors());


const storage = multer.memoryStorage();
const upload = multer({ storage });


mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
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
    const { userId, tripId, prompt } = req.body;
    console.log(userId, tripId);

    if (!userId || !tripId || !prompt) {
        return res.status(400).send('UserId, TripId, and prompt are required.');
    }
    try {
        const images = await Image.find({ userId, tripId }, 'llmResponse url');

        if (images.length === 0) {
            return res.status(404).json({ message: 'No images found for the given userId and tripId.' });
        }


        const responses = images.map((image, index) => `${index}. ${image.llmResponse}`);
        const formattedResponses = responses.join('\n\n');


        const ollamaResponse = await axios.post('http://localhost:11434/api/chat', {
            model: "llama3.2",
            "messages": [
                {
                    "role": "user",
                    "content": `Find the number in Based on the following numbered descriptions, which one best matches this prompt: "${prompt}"? Only return the best-fit index number.\n\nDescriptions:\n\n${formattedResponses}`
                }
            ],
            "stream": false
        });


        console.log('Ollama Response:', JSON.stringify(ollamaResponse.data, null, 2));


        const responseText = ollamaResponse.data.message.content
        console.log(responseText);
        regex = /(\d+)/;
        const match = responseText.match(regex);
        let number = 0
        if (match && match[1]) {
            number = parseInt(match[1], 10);
        }
        const bestFitImage = images[number];


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


// Modified Upload Endpoint
app.post('/upload', upload.single('image'), async (req, res) => {
    const { userId, tripId, description, album } = req.body;


    if (!userId || !tripId || !description || !req.file) {
        return res.status(400).send('UserId, TripId, description, and image are required.');
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


                try {
                    const output = await axios.post('http://localhost:11434/api/generate', {
                        "model": "llava",
                        "prompt": "Tell me about the image (in 1-2 line)",
                        "images": [imageBase64],
                        "stream": false
                    });


                    // Save the image details in MongoDB
                    const newImage = new Image({
                        url: imageUrl,
                        description,
                        album: album || '',
                        userId,   // Save userId
                        tripId,   // Save tripId
                        llmResponse: output.data.response
                    });


                    await newImage.save();


                    res.status(201).json({
                        message: 'Image uploaded and analyzed successfully!',
                        imageUrl: imageUrl,
                        analysis: output.data.response
                    });


                } catch (error) {
                    console.log('Error:', error);
                    res.status(500).send('Error analyzing the image.');
                }
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

app.post('/all', async (req, res) => {
    const { userId, tripId } = req.body;


    if (!userId || !tripId) {
        return res.status(400).json({ message: 'userId and tripId are required.' });
    }


    try {


        const images = await Image.find({ userId, tripId }, 'url'); // Only select the 'url' field


        // Check if images are found
        if (images.length === 0) {
            return res.status(404).json({ message: 'No images found for the given userId and tripId.' });
        }


        // Extract the URLs from the images and send them in the response
        const imageUrls = images.map(image => image.url);
        return res.status(200).json({ imageUrls });


    } catch (error) {
        console.error('Error fetching images:', error);
        return res.status(500).json({ message: 'Error fetching images.' });
    }
});



const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
