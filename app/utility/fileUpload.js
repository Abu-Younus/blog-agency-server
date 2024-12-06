import multer from "multer";
import path from "path";
import fs from "fs";

// Create dynamic folder based on the provided type
const storage = (destination, folderName) => multer.diskStorage({
    destination: (req, file, cb) => {
        const dynamicPath = path.join(destination, folderName);
        fs.mkdirSync(dynamicPath, { recursive: true });
        cb(null, dynamicPath);
    },
    filename: (req, file, cb) => {
        cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`);
    }
});

const fileUpload = (destination, folderType) => multer({
    storage: storage(destination, folderType),
    limits: {
        fileSize: 2 * 1024 * 1024 // 2 MB file size limit
    },
    fileFilter: (req, file, cb) => {
        const allowedMimeTypes = ["image/png", "image/jpg", "image/jpeg", "image/gif"];
        if (allowedMimeTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error("Only .png, .jpg, .jpeg, and .gif formats are allowed!"), false);
        }
    }
});

export const uploadSingleImage = (destination, folderType) => fileUpload(destination, folderType).single('image');
export const uploadMultipleImages = (destination, folderType) => fileUpload(destination, folderType).array('images', 5);
