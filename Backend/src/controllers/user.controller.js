const bcrypt = require("bcrypt");

const path = require('path');
const jwt = require("jsonwebtoken");
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
const User = require("../models/user.model");

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
    const user = await getUserByIdService(id);

    if (!user) {
      return res.status(404).json({ message: "Người dùng không tồn tại" });
    }

    res.status(200).json({
      message: "Thông tin người dùng",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        dateOfBirth: user.dateOfBirth,
      }
    });
  } catch (error) {
    next(error);
  }
};

//cập nhật thông tin người dùng
const updateUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, dateOfBirth } = req.body;
    let updateData = {};

    // Tìm user trước khi cập nhật
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ error: "Người dùng không tồn tại!" });
    }

    // Nếu có tên mới, thêm vào dữ liệu cập nhật
    if (name) {
      updateData.name = name;
    }

    // Nếu có dateOfBirth, kiểm tra hợp lệ rồi thêm vào dữ liệu cập nhật
    if (dateOfBirth) {
      const dob = new Date(dateOfBirth);
      if (isNaN(dob.getTime())) {
        return res.status(400).json({ error: "Ngày sinh không hợp lệ!" });
      }
      updateData.dateOfBirth = dob;
    }

    // Nếu có file ảnh mới => upload lên Cloudinary
    if (req.file) {
      updateData.avatar = req.file.path;

      // Nếu user có avatar cũ => Xóa ảnh cũ trên Cloudinary
      if (user.avatar && user.avatar.includes("cloudinary.com")) {
        try {
          const publicId = user.avatar.split("/").pop().split(".")[0];
          await cloudinary.uploader.destroy(publicId);
        } catch (err) {
          console.error("Lỗi khi xóa ảnh cũ trên Cloudinary:", err);
        }
      }
    }

    // Cập nhật thông tin user
    const updatedUser = await User.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true, // Chạy validator để kiểm tra dữ liệu hợp lệ
    });

    // Kiểm tra nếu cập nhật thất bại
    if (!updatedUser) {
      return res.status(500).json({ error: "Cập nhật thông tin thất bại!" });
    }

    // Trả về thông tin user sau khi cập nhật
    res.status(200).json({
      message: "Cập nhật thông tin thành công",
      user: {
        id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        avatar: updatedUser.avatar,
        dateOfBirth: updatedUser.dateOfBirth,
      },
    });
  } catch (error) {
    console.error("Lỗi server khi cập nhật user:", error);
    res.status(500).json({ error: "Lỗi server. Vui lòng thử lại!" });
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
  // email = email.trim();
  // password = password.trim();

  if (!email || !password) {
    return res.status(400).json({
      status: "FAILED",
      message: "Thông tin đăng nhập trống"
    });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        status: "FAILED",
        message: "Email không tồn tại"
      });
    }

    if (!user.verified) {
      return res.status(403).json({
        status: "FAILED",
        message: "Email chưa được xác minh. Vui lòng kiểm tra hộp thư của bạn."
      });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return res.status(401).json({
        status: "FAILED",
        message: "Mật khẩu không hợp lệ"
      });
    }

    // Tạo JWT token
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET, // Chuỗi bí mật để mã hóa token
      { expiresIn: "1h" } // Thời gian hết hạn của token
    );

    return res.status(200).json({
      status: "SUCCESS",
      message: "Đăng nhập thành công",
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        avatar: user.avatar,
        dateOfBirth: user.dateOfBirth,
        role: user.role,
        token: token // Trả về token cho client
      }
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      status: "FAILED",
      message: "Đã xảy ra lỗi khi kiểm tra người dùng hiện tại"
    });
  }
};
// upload avatar
const uploadAvatar = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Không có file nào được tải lên" });
    }

    console.log("File đã upload:", req.file.path);
    res.json({ secure_url: req.file.path }); // Trả về URL ảnh sau khi upload lên Cloudinary
  } catch (error) {
    console.error("Lỗi upload ảnh:", error);
    res.status(500).json({ message: "Lỗi upload ảnh", error });
  }
}

module.exports = { helloUser, getListUser, updateUser, signup, signin, getUserById, uploadAvatar };