const cloudinary = require("cloudinary").v2;
require("dotenv").config();

// configure ONCE (important)
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

/* ---------------- DISK UPLOAD ---------------- */
const uploadFromPath = async (filePath) => {
    return await cloudinary.uploader.upload(filePath, {
        resource_type: "auto"
    });
};

/* ---------------- MEMORY (BUFFER) UPLOAD ---------------- */
const uploadFromBuffer = (buffer) => {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            { resource_type: "auto" },
            (error, result) => {
                if (error) reject(error);
                else resolve(result);
            }
        );

        stream.end(buffer);
    });
};

module.exports = {
    uploadFromPath,
    uploadFromBuffer
};