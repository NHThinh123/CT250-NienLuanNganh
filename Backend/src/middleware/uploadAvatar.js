const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "avatars", // Tên thư mục lưu trữ trên Cloudinary
    allowed_formats: ["jpg", "png", "jpeg"], // Định dạng ảnh cho phép
    transformation: [
      { width: 500, height: 500, crop: "limit" }, // Giới hạn kích thước
      { quality: "auto:best" }, // Tự động điều chỉnh chất lượng ở mức tốt
    ],
  },
});

const upload = multer({ storage });

module.exports = upload;
