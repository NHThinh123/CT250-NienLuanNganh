const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "posts",
    allowed_formats: ["jpg", "png", "jpeg", "mp4", "webp", "webm"],
    transformation: [{ width: 800, height: 400, crop: "limit" }],
  },
});

const upload = multer({ storage });

module.exports = upload;
