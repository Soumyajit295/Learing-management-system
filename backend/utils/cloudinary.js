import cloudinary from 'cloudinary';
import fs from 'fs';
import path from 'path';

export const uploadAtCloudinary = async (localPath) => {
    if (!localPath) {
        return null;
    }

    try {
        const fileExtension = path.extname(localPath).toLowerCase();

        let options = {};
        let resourceType = '';

        if (fileExtension.match(/\.(jpg|jpeg|png|gif|webp)$/)) {
            resourceType = 'image';
            options = {
                width: 250,
                height: 250,
                crop: 'limit',  
            };
        } else if (fileExtension.match(/\.(mp4|mkv|mov|avi)$/)) {
            resourceType = 'video';
            options = {
                resource_type: 'video',
                chunk_size: 6000000,  
            };
        } else {
            return {
                success: false,
                message: 'Unsupported file type',
            };
        }

        const result = await cloudinary.v2.uploader.upload(localPath, options);

        if (result) {
            fs.unlinkSync(localPath);
            return {
                success: true,
                data: result,
            };
        }
    } catch (err) {
        console.log(`Cloudinary error: ${err.message}`);
        return {
            success: false,
            message: `Cloudinary upload failed: ${err.message}`,
        };
    }
};
