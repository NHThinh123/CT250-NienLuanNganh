const express = require("express");
const router = express.Router();
const path = require('path');
const { signup, signin, getUserById, getListUser, updateUser, uploadAvatar, requestPasswordReset, resetPassword, getEmail } = require("../controllers/user.controller");
const { verifyEmail } = require("../controllers/user.verifiEmail");
const upload = require("../middleware/uploadAvatar");
const User = require("../models/user.model");

//Đăng kí
router.post("/signup", upload.single('avatar'), signup);
//Xác thực tài khoản
router.get("/verify/:userId/:uniqueString", verifyEmail);

router.get('/verified', (req, res) => {
  try {
    res.sendFile(path.join(__dirname, '../views/verification.html'));
  } catch (error) {
    console.error('Error sending verification page:', error);
    res.status(500).send('Internal Server Error');
  }
});
//lấy thông tin người dùng qua id
router.get('/id/:id', getUserById);
//cập nhật thông tin người dùng
router.put('/update/:id', upload.single('avatar'), updateUser, (req, res) => {
});

router.post("/upload-avatar", upload.single('avatar'), uploadAvatar);
//đăng nhập
router.post("/login", signin);
//Gửi yêu cầu đặt lại mật khẩu
router.post("/reset-password-request", requestPasswordReset);

router.get("/reset-password/:token", (req, res) => {
  res.sendFile(path.join(__dirname, "../views/reset-password.html"));
});
//Đặt lại mật khẩu
router.post("/reset-password/:token", resetPassword);
//Lấy email
router.get("/get-email/:token", getEmail);
router.post("/", async (req, res) => {
  try {
    const newUser = await User.create(req.body);
    // Gửi thông báo qua WebSocket khi user mới được tạo
    req.app.get("notifyUserStats")();
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ message: "Error creating user", error });
  }
});

module.exports = router;
