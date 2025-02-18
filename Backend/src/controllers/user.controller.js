const bcrypt = require("bcrypt");
const User = require("../models/user.model");
const path = require('path');
const router = require("express").Router();
const { sendVerificationEmail } = require("../services/email.service");
const moment = require('moment');
const cloudinary = require("../config/cloudinary");
const {
  getListUserService,
  helloUserService,
  getUserByIdService,
  updateUserService,
} = require("../services/user.service");

const getListUser = async (req, res, next) => {
  try {
    const data = await getListUserService();
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};
const helloUser = async (req, res, next) => {
  try {
    const data = await helloUserService();
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

// const createUser = async (req, res, next) => {
//   try {
//     const { email, username, password, role } = req.body;
//     const data = await createUserService(email, username, password, role);
//     res.status(200).json(data);
//   } catch (error) {
//     next(error);
//   }
// };
//lấy thông tin người dùng thông qua id
const getUserById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = await getUserByIdService(id);

    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};
//cập nhật thông tin người dùng
const updateUser = async (req, res, next) => {
  try {
    const { id } = req.params;  // Lấy ID user từ params
    const updateData = req.body;

    // Kiểm tra user có tồn tại không
    const user = await User.findById(id);
    if (!user) {
      return next(new AppError(404, "Người dùng không tồn tại"));
    }

    // Nếu có file ảnh mới => upload lên Cloudinary
    if (req.file) {
      const avatarUrl = req.file.path;  // URL ảnh từ Cloudinary
      updateData.avatar = avatarUrl; // Thêm avatar mới vào updateData

      // Nếu user có avatar cũ => Xóa ảnh cũ trên Cloudinary (nếu cần)
      if (user.avatar) {
        const publicId = user.avatar.split('/').pop().split('.')[0]; // Lấy public_id từ URL cũ
        await cloudinary.uploader.destroy(publicId); // Xóa ảnh cũ trên Cloudinary
      }
    }

    // Cập nhật thông tin user
    const updatedUser = await User.findByIdAndUpdate(id, updateData, { new: true });

    res.status(200).json({
      message: "Cập nhật thông tin thành công",
      data: {
        id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        avatar: updatedUser.avatar,
        dateOfBirth: updatedUser.dateOfBirth,
      }
    });

  } catch (error) {
    console.error("Lỗi khi cập nhật user:", error);
    return res.status(500).json({ message: "Lỗi! Không thể cập nhật thông tin user" });
  }
};

//singup
const signup = async (req, res) => {
  try {
    let { name, email, password, dateOfBirth, role } = req.body;
    name = name.trim().replace(/\s+/g, ' ');
    email = email.trim();
    dateOfBirth = dateOfBirth.trim();
    password = password.trim();
    role = role.trim();

    if (!name || !email || !password || !dateOfBirth || !role) {
      return res.status(400).json({ message: "Dữ liệu trống" });
    }

    if (!/^[\p{L}\s]+$/u.test(name)) {
      return res.status(400).json({ status: "FAILED", message: "Tên đăng nhập không hợp lệ." });
    }

    if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
      return res.status(400).json({ status: "FAILED", message: "Email không hợp lệ" });
    }

    if (!moment(dateOfBirth, 'YYYY-MM-DD', true).isValid()) {
      return res.status(400).json({ status: "FAILED", message: "Ngày - Tháng - Năm không hợp lệ" });
    }

    if (!/^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$#!%*?&]{8,}$/.test(password)) {
      return res.status(400).json({
        status: "FAILED",
        message: "Mật khẩu phải có chữ Hoa, chữ thường, số, ký tự đặc biệt và có độ dài lớn hơn 8 ký tự!"
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Người dùng đã tồn tại" });
    }

    // const isEmailValid = await verifyEmailExists(email);
    // if (!isEmailValid) {
    //   return res.status(400).json({
    //     status: "FAILED",
    //     message: "Email không tồn tại hoặc không thể gửi email xác thực"
    //   });
    // }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Xử lý upload ảnh lên Cloudinary
    let avatarUrl = null;
    if (req.file) {
      avatarUrl = req.file.path;
    }

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      dateOfBirth,
      role,
      avatar: avatarUrl // Lưu link ảnh vào DB
    });

    await newUser.save();

    await sendVerificationEmail(newUser);

    res.status(201).json({
      status: "PENDING",
      message: "Tài khoản đã được tạo. Vui lòng kiểm tra email xác thực!",
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        avatar: newUser.avatar,
        dateOfBirth: newUser.dateOfBirth,
      }
    });

  } catch (error) {
    console.error("Lỗi khi đăng ký:", error);
    res.status(500).json({
      status: "FAILED",
      message: "Lỗi server khi đăng ký người dùng"
    });
  }
};

//singin
const signin = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.json({
      status: "FAILED",
      message: "Thông tin đăng nhập trống"
    });
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.json({
        status: "FAILED",
        message: "Thông tin đăng nhập không hợp lệ"
      });
    }

    if (!user.verified) {
      return res.json({
        status: "FAILED",
        message: "Email chưa được xác minh. Vui lòng kiểm tra hộp thư của bạn."
      });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return res.json({
        status: "FAILED",
        message: "Mật khẩu không hợp lệ"
      });
    }

    return res.json({
      status: "SUCCESS",
      message: "Đăng nhập thành công",
      data: {
        id: user._id,
        email: user.email,
        name: user.name,
        avatar: user.avatar,
        dateOfBirth: user.dateOfBirth,
        role: user.role
      }
    });
  } catch (err) {
    console.error(err);
    return res.json({
      status: "FAILED",
      message: "Đã xảy ra lỗi khi kiểm tra người dùng hiện tại"
    });
  }
};
// Route này cần để hiển thị trang xác minh

module.exports = { helloUser, getListUser, updateUser, signup, signin, getUserById };