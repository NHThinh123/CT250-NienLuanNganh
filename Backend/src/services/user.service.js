require("dotenv").config();
const bcrypt = require("bcrypt");
const User = require('../models/user.model');
const saltRounds = 10;
const AppError = require("../utils/AppError");

const getListUserService = async () => {
  let result = await User.find().select("-password");
  return result;
};

const helloUserService = async () => {
  return {
    message: "Hello user!",
  };
};

// const createUserService = async (email, username, password, role) => {
//   //kiểm tra email tồn tại hay chưa
//   const existingUser = await User.findOne({ email });
//   if (existingUser) {
//     throw new AppError("Email already exists.", 400);
//   }
//   //mã hóa mật khẩu
//   const hashPassword = await bcrypt.hash(password, saltRounds);
//   //tạo người dùng mới
//   let result = await User.create({
//     email: email,
//     username: username,
//     password: hashPassword,
//     role: role,
//   });

//   return result;
// };
//câp nhật thông tin người dùng
const updateUserService = async (id, updateData) => {
  try {
    const user = await User.findByIdAndUpdate(id, updateData, {
      new: true, // Trả về dữ liệu mới sau khi cập nhật
      runValidators: true, // Chạy validator để kiểm tra dữ liệu hợp lệ
    });

    if (!user) {
      throw new Error("User not found");
    }

    return user;
  } catch (error) {
    throw new Error(error.message);
  }
};
//lấy thông tin người dùng theo id
const getUserByIdService = async (id) => {
  try {
    const user = await User.findById(id);
    if (!user) {
      throw new Error("User not found");
    }
    return user;
  } catch (error) {
    throw new Error(error.message);
  }
};

// Kiểm tra thông tin đăng nhập
const checkUserCredentials = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error('User not found');
  }

  if (!user.verified) {
    throw new Error('Email chưa được xác minh');
  }

  const isPasswordCorrect = await bcrypt.compare(password, user.password);
  if (!isPasswordCorrect) {
    throw new Error('Invalid password');
  }

  return user;
};
module.exports = { getListUserService, helloUserService, checkUserCredentials, updateUserService, getUserByIdService };
