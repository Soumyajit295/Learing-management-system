import cloudinary from 'cloudinary';
import fs from 'fs';
import path from 'path';

export const uploadAtCloudinary = async (localPath) => {
    if (!localPath) {
        return { success: false, message: 'No file provided' };
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
            return { success: false, message: 'Unsupported file type' };
        }

        console.log(`Uploading file: ${localPath} as ${resourceType}`);
        const result = await cloudinary.v2.uploader.upload(localPath, options);

        if (result) {
            fs.unlinkSync(localPath);
            console.log(`Upload successful: ${result.secure_url}`);
            return { success: true, data: result };
        }
    } catch (err) {
        console.error(`Cloudinary error: ${err.message}`);
        return { success: false, message: `Cloudinary upload failed: ${err.message}` };
    }
};
