const {
  getBusinessService,
  getBusinessByIdService,
  updateBusinessService,
  updateRatingAverageService,
  updateDishCostBusinessService,
} = require("../services/business.service");
const AppError = require("../utils/AppError");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const stripe = require("../config/stripe")
const Payment = require("../models/payment.model");
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
    const { id } = req.params;
    const { business_name, close_hours, open_hours, contact_info, location } = req.body;
    let updateData = {};

    // Tìm doanh nghiệp trước khi cập nhật
    const business = await Business.findById(id);
    if (!business) {
      return res.status(404).json({ error: "Doanh nghiệp không tồn tại!" });
    }

    // Nếu có thông tin mới, thêm vào dữ liệu cập nhật
    if (business_name) updateData.business_name = business_name;
    if (open_hours) updateData.open_hours = open_hours;
    if (close_hours) updateData.close_hours = close_hours;
    if (contact_info) updateData.contact_info = contact_info;
    if (location) updateData.location = location;

    // Nếu có file ảnh mới => upload lên Cloudinary
    if (req.file) {
      updateData.avatar = req.file.path;

      // Nếu business có avatar cũ => Xóa ảnh cũ trên Cloudinary
      if (business.avatar && business.avatar.includes("cloudinary.com")) {
        try {
          const publicId = business.avatar.match(/\/([^\/]+)\.[a-z]+$/i)?.[1];
          if (publicId) {
            await cloudinary.uploader.destroy(publicId);
          }
        } catch (err) {
          console.error("Lỗi khi xóa ảnh cũ trên Cloudinary:", err);
        }
      }
    }

    // Kiểm tra nếu không có dữ liệu nào để cập nhật
    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ error: "Không có dữ liệu nào để cập nhật!" });
    }

    // Cập nhật thông tin business
    const updatedBusiness = await Business.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    // Kiểm tra nếu cập nhật thất bại
    if (!updatedBusiness) {
      return res.status(500).json({ error: "Cập nhật thông tin thất bại!" });
    }

    // Trả về thông tin business sau khi cập nhật
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
    console.error("Lỗi server khi cập nhật business:", error);
    res.status(500).json({ error: "Lỗi server. Vui lòng thử lại!" });
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

    const existingBusiness = await Business.findOne({ email });
    if (existingBusiness) {
      return res.status(400).json({ message: "Business already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    let avatarUrl = null;
    if (req.file) {
      avatarUrl = req.file.path;
    }

    const newBusiness = new Business({
      business_name,
      open_hours,
      close_hours,
      location,
      contact_info,
      email,
      password: hashedPassword,
      avatar: avatarUrl,
      status: "pending",
    });

    await newBusiness.save();
    res.status(201).json({
      status: "PENDING",
      message: "Tài khoản đã được tạo! Vui lòng hoàn tất thanh toán để kích hoạt.",
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
      redirectTo: `/payment/activation/${newBusiness._id}`,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Xử lý thanh toán kích hoạt
const processActivationPayment = async (req, res) => {
  const { businessId } = req.params;
  const { paymentMethodId, amount } = req.body;

  try {
    const business = await Business.findById(businessId);
    if (!business) {
      return res.status(404).json({ message: "Không tìm thấy tài khoản" });
    }

    // Tạo Payment Intent với automatic_payment_methods
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100,
      currency: "usd",
      payment_method: paymentMethodId,
      confirm: true,
      automatic_payment_methods: {
        enabled: true,
        allow_redirects: "never", // Chỉ chấp nhận thanh toán không cần redirect
      },
    });

    if (paymentIntent.status === "succeeded") {
      business.status = "active";
      business.activationPayment = true;
      business.lastPaymentDate = new Date();
      business.nextPaymentDueDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
      await business.save();

      const payment = new Payment({
        businessId: business._id,
        businessName: business.business_name,
        amount: amount,
      });
      await payment.save();

      res.status(200).json({
        message: "Thanh toán thành công! Tài khoản đã được kích hoạt.",
        amount: amount,
        paymentId: payment._id,
      });
    } else {
      res.status(400).json({ message: "Thanh toán thất bại" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// Xử lý thanh toán phí duy trì
const processMonthlyPayment = async (req, res) => {
  const { businessId } = req.params;
  const { paymentMethodId, amount } = req.body;

  try {
    const business = await Business.findById(businessId);
    if (!business) {
      return res.status(404).json({ message: "Không tìm thấy tài khoản" });
    }

    // Tạo thanh toán qua Stripe
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100,
      currency: "vnd",
      payment_method: paymentMethodId,
      confirm: true,
      automatic_payment_methods: {
        enabled: true,
        allow_redirects: "never", // Chỉ chấp nhận thanh toán không cần redirect
      },

    });

    if (paymentIntent.status === "succeeded") {
      business.lastPaymentDate = new Date();
      business.nextPaymentDueDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
      business.status = "active";
      await business.save();

      const payment = new Payment({
        businessId: business._id,
        businessName: business.business_name,
        amount: amount,
      });
      await payment.save();

      res.status(200).json({
        message: "Thanh toán phí duy trì thành công!",
        amount: amount,
        paymentId: payment._id,
      });
    } else {
      res.status(400).json({ message: "Thanh toán thất bại" });
    }
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

const updateDishCostBusiness = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updatedBusiness = await updateDishCostBusinessService(id);
    res.status(200).json(updatedBusiness);
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
  updateDishCostBusiness,
  processActivationPayment,
  processMonthlyPayment,
};
