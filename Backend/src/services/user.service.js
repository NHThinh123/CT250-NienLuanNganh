require("dotenv").config();
const bcrypt = require("bcrypt");
const saltRounds = 10;

const User = require("../models/user.model");
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

const createUserService = async (email, username, password, role) => {
  //kiểm tra email tồn tại hay chưa
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new AppError("Email already exists.", 400);
  }
  //mã hóa mật khẩu
  const hashPassword = await bcrypt.hash(password, saltRounds);
  //tạo người dùng mới
  let result = await User.create({
    email: email,
    username: username,
    password: hashPassword,
    role: role,
  });

  return result;
};
module.exports = { getListUserService, helloUserService, createUserService };
