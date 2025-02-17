const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'avatars', // Tên thư mục lưu trữ trên Cloudinary
        allowed_formats: ['jpg', 'png', 'jpeg'], // Định dạng ảnh cho phép
        transformation: [{ width: 500, height: 500, crop: 'limit' }]
    }
});

const upload = multer({ storage });

module.exports = upload;
