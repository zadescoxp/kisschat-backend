import multer from "multer";
// Configure multer for memory storage
const storage = multer.memoryStorage();
// File filter for images only
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    }
    else {
        cb(new Error('Only image files are allowed'));
    }
};
// Create multer upload instance
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
    },
    fileFilter: fileFilter
});
// Export middleware for single file upload
export const uploadSingleImage = upload.single('avatar');
// Export middleware for multiple files if needed in future
export const uploadMultipleImages = upload.array('images', 10);
