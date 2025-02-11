const bcrypt = require("bcrypt");
const User = require("../models/user.model");
const path = require('path');
const router = require("express").Router();
const { sendVerificationEmail } = require("../services/email.service");
const moment = require('moment');
const {
  createUserService,
  getListUserService,
  helloUserService,
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

const createUser = async (req, res, next) => {
  try {
    const { email, username, password, role } = req.body;
    const data = await createUserService(email, username, password, role);
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};
const updateUser = async (req, res, next) => {
  try {
    const { email, name, dateofBirth } = req.body;
    const data = await createUserService(email, name, dateofBirth);
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
}
//singup
const signup = async (req, res) => {
  let { name, email, password, dateOfBirth, role } = req.body;
  name = name.trim().replace(/\s+/g, ' ');
  email = email.trim();
  dateOfBirth = dateOfBirth.trim();
  password = password.trim();
  role = role.trim();

  if (!name || !email || !password || !dateOfBirth || !role) {
    return res.status(400).json({ message: "Dữ liệu trống" });
  }
  else if (!/^[\p{L}\s]+$/u.test(name)) {
    res.json({
      status: "FAILED",
      message: "Tên đăng nhập không hợp lệ."
    });
  } else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
    res.json({
      status: "FAILED",
      message: "Email không hợp lệ"
    });
  } else if (!moment(dateOfBirth, 'YYYY-MM-DD', true).isValid()) {
    res.json({
      status: "FAILED",
      message: "Ngày - Tháng - Năm không hợp lệ"
    });
  } else if (!/^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(password)) {
    res.json({
      status: "FAILED",
      message: "Mật khẩu không hợp lệ. Mật khẩu phải có chữ Hoa(A,B,C),chữ thường(a,b,c), số(1,2,3), kí tự đặc biệt(!,@,#,$,%) và có độ dài lớn hơn 8 kí tự!"
    })
  };

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Người dùng đã tồn tại" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword, dateOfBirth, role });
    await newUser.save();

    await sendVerificationEmail(newUser);
    res.status(201).json({ status: "PENDING", message: "Tài khoản đã được tạo. Vui lòng kiểm tra email xác thực!" });
  } catch (error) {
    console.error("Lỗi khi đăng ký:", error);
    res.status(500).json({ status: "FAILED", message: "Lỗi server khi đăng ký người dùng" });
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
      data: user,
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

module.exports = { helloUser, createUser, getListUser, updateUser, signup, signin };