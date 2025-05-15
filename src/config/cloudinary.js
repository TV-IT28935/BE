CLOUDINARY_NAME=ds8zryquj
CLOUDINARY_URL=cloudinary://315366426917413:LoZUEIQsPEsLwVO8PpFpqJA0YnY@ds8zryquj
CLOUDINARY_URL_API_SECRET=LoZUEIQsPEsLwVO8PpFpqJA0YnY
CLOUDINARY_URL_API_KEY=315366426917413

import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET 
});


export default cloudinary;