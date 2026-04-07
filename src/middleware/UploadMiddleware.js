const multer = require("multer");
const path = require("path");
const fs = require("fs");

// ensure uploads folder exists
const uploadDir = path.join(__dirname, "../uploads");

if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

/* ---------------- DISK STORAGE ---------------- */
const diskStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        const baseName = path.basename(file.originalname, ext);
        cb(null, `${baseName}-${Date.now()}${ext}`);
    }
});

const uploadToDisk = multer({
    storage: diskStorage,
    limits: {
        fileSize: 10 * 1024 * 1024 // 10 MB
    }
});

/* ---------------- MEMORY STORAGE ---------------- */
const memoryStorage = multer.memoryStorage();

const uploadToMemory = multer({
    storage: memoryStorage,
    limits: {
        fileSize: 10 * 1024 * 1024 // 10 MB
    }
});

module.exports = {
    uploadToDisk,
    uploadToMemory
};