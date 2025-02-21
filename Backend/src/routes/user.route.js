const express = require("express");
const router = express.Router();
const path = require('path');
const { signup, signin, getUserById, getListUser, updateUser, uploadAvatar } = require("../controllers/user.controller");
const { verifyEmail } = require("../controllers/user.verifiEmail");
const upload = require("../middleware/uploadAvatar");

router.post("/signup", upload.single('avatar'), signup);
router.get("/verify/:userId/:uniqueString", verifyEmail);

router.get('/verified', (req, res) => {
  try {
    res.sendFile(path.join(__dirname, '../views/verification.html'));
  } catch (error) {
    console.error('Error sending verification page:', error);
    res.status(500).send('Internal Server Error');
  }
});
router.get('/id/:id', getUserById);
router.put('/update/:id', upload.single('avatar'), updateUser, (req, res) => {
  console.log("👉 Request received at /api/user/update/:id");
  console.log("🔹 Headers:", req.headers);
  console.log("🔹 Body:", req.body);
  console.log("🔹 File:", req.file);  // Kiểm tra ảnh có được gửi không
});

router.post("/upload-avatar", upload.single('avatar'), uploadAvatar);
router.post("/login", signin);

module.exports = router;
