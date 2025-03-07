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
const stripe = require("../config/stripe");
const Payment = require("../models/payment.model");
const Business = require("../models/business.model");
const cloudinary = require("cloudinary").v2;
const ResetTokenBusiness = require("../models/businessResetPassword.model")
const { sendBusinessVerificationEmail, sendBusinessResetPasswordEmail } = require("../services/email.service");
const crypto = require("crypto");



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
    const { business_name, close_hours, open_hours, contact_info, location } =
      req.body;
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
      return res
        .status(400)
        .json({ error: "Không có dữ liệu nào để cập nhật!" });
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
      return res.status(400).json({ message: "Email đã tồn tại!" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    let avatarUrl =
      "https://res.cloudinary.com/nienluan/image/upload/v1741245839/Business_Avatar_Default_jkhjhf.jpg";
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
    await sendBusinessVerificationEmail(newBusiness)
    res.status(201).json({
      status: "PENDING",
      message:
        "Tài khoản đã được tạo! Vui lòng hoàn tất thanh toán để kích hoạt.",
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
  const { paymentMethodId, amount, planType } = req.body;

  try {
    // Kiểm tra amount
    if (!amount || isNaN(amount) || amount <= 0) {
      return res.status(400).json({ message: "Số tiền không hợp lệ." });
    }

    // Kiểm tra planType
    if (!planType || !["monthly", "yearly"].includes(planType)) {
      return res.status(400).json({ message: "Loại gói không hợp lệ." });
    }

    const business = await Business.findById(businessId);
    if (!business) {
      return res.status(404).json({ message: "Không tìm thấy tài khoản" });
    }

    // Tạo PaymentIntent với Stripe
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency: "usd",
      payment_method: paymentMethodId,
      confirm: true,
      automatic_payment_methods: {
        enabled: true,
        allow_redirects: "never",
      },
    });

    if (paymentIntent.status === "succeeded") {
      const isActivation = business.status === "suspended" || !business.activationPayment;

      // Cập nhật Business
      business.status = "active";
      business.lastPaymentDate = new Date();

      // Cập nhật nextPaymentDueDate dựa trên planType
      if (planType === "yearly") {
        business.nextPaymentDueDate = new Date(
          business.lastPaymentDate.getTime() + 365 * 24 * 60 * 60 * 1000
        );
      } else {
        business.nextPaymentDueDate = new Date(
          business.lastPaymentDate.getTime() + 30 * 24 * 60 * 60 * 1000
        );
      }

      // Chỉ đặt activationPayment = true nếu là kích hoạt
      if (isActivation) {
        business.activationPayment = true;
      }

      // Đặt lại reminderSent để chuẩn bị cho chu kỳ mới
      business.reminderSent = false;

      await business.save();

      const payment = new Payment({
        businessId: business._id,
        businessName: business.business_name,
        amount: amount,
        type: isActivation ? "activation" : "renewal", // Phân biệt loại thanh toán
      });
      await payment.save();

      res.status(200).json({
        message: isActivation
          ? "Thanh toán thành công! Tài khoản đã được kích hoạt."
          : "Thanh toán thành công! Gói đã được gia hạn.",
        amount: amount,
        paymentId: payment._id,
      });
    } else {
      console.log("PaymentIntent status:", paymentIntent.status);
      res.status(400).json({
        message: "Thanh toán chưa hoàn tất.",
        status: paymentIntent.status,
      });
    }
  } catch (error) {
    console.error(
      "Error in processActivationPayment:",
      error.message,
      error.stack
    );
    res.status(500).json({ message: error.message || "Lỗi server nội bộ." });
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
      business.nextPaymentDueDate = new Date(
        Date.now() + 30 * 24 * 60 * 60 * 1000
      );
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
      return res.status(404).json({ message: "Tài khoản không tồn tại" });
    }
    if (!business.verified) {
      return res.status(403).json({
        status: "FAILED",
        message: "Email chưa được xác minh. Vui lòng kiểm tra hộp thư của bạn."
      });
    }

    // Kiểm tra mật khẩu
    const isMatch = await bcrypt.compare(password, business.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Mật khẩu không chính xác" });
    }

    // Tạo token
    const token = jwt.sign(
      { id: business._id, email: business.email },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // Trả về thông tin đăng nhập thành công
    res.status(200).json({
      status: "Loginsuccessful",
      message: "Đăng nhập thành công",
      business: {
        id: business._id,
        business_name: business.business_name,
        email: business.email,
        contact_info: business.contact_info,
        location: business.location,
        avatar: business.avatar,
        open_hours: business.open_hours,
        close_hours: business.close_hours,
        status: business.status,
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
//Gửi yêu cầu đặt lại mật khẩu
const requestBusinessPasswordReset = async (req, res) => {
  console.log("Request body received:", req.body);
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ message: "Email không được để trống!" });
  }

  const business = await Business.findOne({ email });
  if (!business) {
    return res.status(400).json({ message: "Email không tồn tại!" });
  }

  const resetToken = crypto.randomBytes(32).toString("hex");
  const expiresAt = Date.now() + 15 * 60 * 1000; // Hết hạn sau 15 phút

  await ResetTokenBusiness.create({
    businessId: business._id,
    token: resetToken,
    expiresAt,
  });

  await sendBusinessResetPasswordEmail(business.email, resetToken);

  res
    .status(200)
    .json({ message: "Link đặt lại mật khẩu đã được gửi qua email!" });
};
//Đặt lại mật khẩu
const resetBusinessPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { newPassword } = req.body;

    if (!newPassword) {
      return res.status(400).json({ message: "Mật khẩu không được để trống!" });
    }

    const resetToken = await ResetTokenBusiness.findOne({ token });

    if (!resetToken || !resetToken.businessId || resetToken.expiresAt < Date.now()) {
      return res.status(400).json({ message: "Token không hợp lệ hoặc đã hết hạn!" });
    }

    // Mã hóa mật khẩu mới
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Cập nhật mật khẩu của user
    const updatedBusiness = await Business.findByIdAndUpdate(
      resetToken.businessId,
      { password: hashedPassword },
      { new: true } // Trả về user đã được cập nhật
    );

    if (!updatedBusiness) {
      return res.status(400).json({ message: "Không tìm thấy người dùng, đặt lại mật khẩu thất bại!" });
    }

    // Xóa token đặt lại mật khẩu sau khi sử dụng
    await ResetTokenBusiness.findOneAndDelete({ token });

    res.status(200).json({
      message: "Mật khẩu đã được đặt lại thành công! Vui lòng đăng nhập lại.",
    });
  } catch (error) {
    console.error("Lỗi đặt lại mật khẩu:", error);
    res.status(500).json({ message: "Lỗi server khi đặt lại mật khẩu" });
  }
};
//Lấy email
const getBusinessEmail = async (req, res) => {
  const { token } = req.params;

  try {
    // Tìm token trong bảng ResetToken
    const resetRequest = await ResetTokenBusiness.findOne({ token });

    if (!resetRequest) {
      return res
        .status(404)
        .json({ message: "Token không hợp lệ hoặc đã hết hạn" });
    }

    // Dùng businessId để tìm user trong bảng businesses
    const business = await Business.findById(resetRequest.businessId);

    if (!business) {
      return res.status(404).json({ message: "Không tìm thấy người dùng" });
    }

    // Trả về email của người dùng
    res.json({ email: business.email });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server, vui lòng thử lại" });
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
  requestBusinessPasswordReset,
  resetBusinessPassword,
  getBusinessEmail

};
