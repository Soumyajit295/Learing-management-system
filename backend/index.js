import dotenv from 'dotenv';
import app from './app.js';
import { connectToDb } from './db/db.js';
import cloudinary from 'cloudinary';
import Razorpay from 'razorpay';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

dotenv.config({ path: '.env' });

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

cloudinary.v2.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUDINARY_APIKEY,
    api_secret: process.env.CLOUDINARY_APISECRET,
});


export const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_SECRET,
});


const port = process.env.PORT || 3000;

connectToDb()
    .then(() => {
        app.listen(port, () => {
            console.log(`Server listening on port: ${port}`);
        });
    })
    .catch((err) => {
        console.error('Database connection error:', err.message);
    });
