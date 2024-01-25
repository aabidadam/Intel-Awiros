const express = require('express');
const cors = require('cors');
const multer = require('multer'); // To handle file uploads
const app = express();
const { spawn } = require('child_process');
const path = require('path');

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

const storage = multer.memoryStorage();
const upload = multer({ storage });

const process_image = (userImageBase64, datasetImageFileName) => {
    return new Promise((resolve, reject) => {
        const datasetImageFilePath = path.join(__dirname, 'Images', datasetImageFileName);
    
        const data = {
            userImage: userImageBase64,
            datasetImage: datasetImageFilePath,
        };
        
        const dataJson = JSON.stringify(data);
        const pythonProcess = spawn('python', ['./Model/ssi-model.py', JSON.stringify(dataJson)]);
    
        let mlResponse = '';
    
        pythonProcess.stdout.on('data', (data) => {
            mlResponse += data;
        });
    
        pythonProcess.on('close', () => {
            // Process the mlResponse and send it to the frontend
            // console.log('1 ', mlResponse);
            mlResponse = parseFloat(mlResponse); // Convert to a floating-point number
            mlResponse = mlResponse.toFixed(2);
            resolve(mlResponse); // Resolve the promise with the response
        });
    });
};


app.post('/', upload.single('image'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No image uploaded' });
    }
    const userImageBuffer = req.file.buffer;
    const userImageBase64 = userImageBuffer.toString('base64');

    const image_Dataset = ['gully-cricket-cover-drive.jpg', 'Virat-Kohli-Cover-Drive.jpeg', 'msd-pullshot.jpeg', 'sachin-cv-test.jpg', 'sachin-cv.jpeg', 'vk-cover.jpg', 'vk-cv-test-cap.jpg', 'vk-cv-test-helmet.jpg'];
    
    // Use Promise.all to process all images concurrently
    const mlResponses = await Promise.all(image_Dataset.map(async (img) => {
        const datasetImageFileName = img;
        const ssim = await process_image(userImageBase64, datasetImageFileName);
        // console.log('2 ', ssim);
        return ssim;
    }));
    // Find the maximum SSIM value from the array of responses
    const mlResponse = Math.max(...mlResponses); // Round to two decimal places

    res.status(200).json({ mlResponse });
});


app.listen(PORT, () => {
    console.log(`Server running on port: ${PORT}`);
});
