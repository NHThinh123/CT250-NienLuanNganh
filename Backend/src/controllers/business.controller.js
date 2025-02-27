const {
  getBusinessService,
  getBusinessByIdService,
  updateBusinessService,
  updateRatingAverageService,
} = require("../services/business.service");
const AppError = require("../utils/AppError");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Business = require("../models/business.model");
const cloudinary = require("cloudinary").v2;

const getBusiness = async (req, res, next) => {
  try {
    const data = await getBusinessService();
    res.status(200).json(data);
  } catch (error) {
    return next(new AppError(500, "Lỗi! Không thể lấy business"));
  }
};

const getBusinessById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = await getBusinessByIdService(id);

    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

//cập nhật thông tin business
const updateBusiness = async (req, res, next) => {
  try {
    const { id } = req.params; // Lấy ID business từ params
    const updateData = req.body;

    // Kiểm tra business có tồn tại không
    const business = await Business.findById(id);
    if (!business) {
      return next(new AppError(404, "Business không tồn tại"));
    }

    // Nếu có file ảnh mới => upload lên Cloudinary
    if (req.file) {
      const avatarUrl = req.file.path; // URL ảnh từ Cloudinary
      updateData.avatar = avatarUrl; // Thêm avatar mới vào updateData

      // Nếu business có avatar cũ => Xóa ảnh cũ trên Cloudinary (nếu cần)
      if (business.avatar) {
        const publicId = business.avatar.split("/").pop().split(".")[0]; // Lấy public_id từ URL cũ
        await cloudinary.uploader.destroy(publicId); // Xóa ảnh cũ trên Cloudinary
      }
    }

    // Cập nhật thông tin business
    const updatedBusiness = await Business.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    res.status(200).json({
      message: "Cập nhật thông tin thành công",
      business: {
        id: updatedBusiness._id,
        business_name: updatedBusiness.business_name,
        email: updatedBusiness.email,
        contact_info: updatedBusiness.contact_info,
        location: updatedBusiness.location,
        avatar: updatedBusiness.avatar,
        open_hours: updatedBusiness.open_hours,
        close_hours: updatedBusiness.close_hours,
      },
    });
  } catch (error) {
    console.error("Lỗi khi cập nhật business:", error);
    return res
      .status(500)
      .json({ message: "Lỗi! Không thể cập nhật thông tin business" });
  }
};

// Signup
const signupBusiness = async (req, res, next) => {
  try {
    const {
      business_name,
      open_hours,
      close_hours,
      location,
      contact_info,
      email,
      password,
    } = req.body;

    // Kiểm tra business đã tồn tại chưa
    const existingBusiness = await Business.findOne({ email });
    if (existingBusiness) {
      return res.status(400).json({ message: "Business already exists" });
    }

    // Mã hóa mật khẩu trước khi lưu
    const hashedPassword = await bcrypt.hash(password, 10);
    //xử lý ảnh up lên cloudinary
    let avatarUrl = null;
    if (req.file) {
      avatarUrl = req.file.path;
    }

    // Tạo business mới
    const newBusiness = new Business({
      business_name,
      open_hours,
      close_hours,
      location,
      contact_info,
      email,
      password: hashedPassword,
      avatar: avatarUrl,
    });

    await newBusiness.save();
    res.status(201).json({
      status: "PENDING",
      message: "Tài khoản đã được tạo!",
      business: {
        id: newBusiness._id,
        business_name: newBusiness.business_name,
        email: newBusiness.email,
        contact_info: newBusiness.contact_info,
        location: newBusiness.location,
        avatar: newBusiness.avatar,
        open_hours: newBusiness.open_hours,
        close_hours: newBusiness.close_hours,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
//Đăng nhập
const loginBusiness = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    // Tìm business theo email
    const business = await Business.findOne({ email });
    if (!business) {
      return res.status(404).json({ message: "Email not found" });
    }

    // Kiểm tra mật khẩu
    const isMatch = await bcrypt.compare(password, business.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Wrong password" });
    }

    // Tạo token
    const token = jwt.sign(
      { id: business._id, email: business.email },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // Trả về thông tin đăng nhập thành công
    res.status(200).json({
      message: "Login successful",
      business: {
        id: business._id,
        business_name: business.business_name,
        email: business.email,
        contact_info: business.contact_info,
        location: business.location,
        avatar: business.avatar,
        open_hours: business.open_hours,
        close_hours: business.close_hours,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const updateRatingAverage = async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = await updateRatingAverageService(id);
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getBusiness,
  getBusinessById,
  updateBusiness,
  signupBusiness,
  loginBusiness,
  updateRatingAverage,
};
