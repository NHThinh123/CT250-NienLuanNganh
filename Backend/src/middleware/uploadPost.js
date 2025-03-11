const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "posts",
    resource_type: "auto",
    transformation: [{ width: 800, height: 400, crop: "limit" }],
  },
});

const upload = multer({ storage });

module.exports = upload;
