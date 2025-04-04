const {
  getBusinessService,
  getBusinessByIdService,
  updateRatingAverageService,
  updateTotalReviewsService,
  updateDishCostBusinessService,
} = require("../services/business.service");
const AppError = require("../utils/AppError");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const stripe = require("../config/stripe");
const Payment = require("../models/payment.model");
const Business = require("../models/business.model");
const cloudinary = require("cloudinary").v2;
const ResetTokenBusiness = require("../models/businessResetPassword.model");
const {
  sendBusinessVerificationEmail,
  sendBusinessResetPasswordEmail,
} = require("../services/email.service");
const crypto = require("crypto");
const { create } = require("../models/userVerification.model");

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
    const {
      business_name,
      close_hours,
      open_hours,
      contact_info,
      location,
      address,
      oldPassword,
      newPassword,
    } = req.body;
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
    if (address) updateData.address = address;

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
    if (newPassword) {
      // Yêu cầu mật khẩu cũ nếu thay đổi mật khẩu
      if (!oldPassword) {
        return res.status(400).json({ error: "Vui lòng cung cấp mật khẩu cũ!" });
      }

      // So sánh mật khẩu cũ với mật khẩu trong DB
      const isMatch = await bcrypt.compare(oldPassword, business.password);
      if (!isMatch) {
        return res.status(400).json({ error: "Mật khẩu cũ không đúng!" });
      }

      // Kiểm tra định dạng mật khẩu mới bằng regex
      const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$#!%*?&]{8,}$/;
      if (!passwordRegex.test(newPassword)) {
        return res.status(400).json({
          error: "Mật khẩu mới phải dài ít nhất 8 ký tự, chứa ít nhất 1 chữ cái in hoa, 1 số và 1 ký tự đặc biệt trong @$!%*?&#!"
        });
      }

      // Mã hóa mật khẩu mới
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      updateData.password = hashedPassword;
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

    // Gửi thông báo qua WebSocket
    const notifyClients = req.app.get("notifyClients");
    notifyClients(id);

    // Trả về thông tin business sau khi cập nhật
    res.status(200).json({
      message: "Cập nhật thông tin thành công",
      business: {
        id: updatedBusiness._id,
        business_name: updatedBusiness.business_name,
        email: updatedBusiness.email,
        contact_info: updatedBusiness.contact_info,
        location: updatedBusiness.location,
        address: updatedBusiness.address,
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

    // Phân tích chuỗi address thành đối tượng
    const address = JSON.parse(req.body.address);

    // Kiểm tra các trường bắt buộc
    if (
      !business_name ||
      !open_hours ||
      !close_hours ||
      !location ||
      !address ||
      !contact_info ||
      !email ||
      !password
    ) {
      return res
        .status(400)
        .json({ message: "Vui lòng cung cấp đầy đủ thông tin bắt buộc!" });
    }

    // Kiểm tra định dạng address
    if (
      !address.type ||
      !address.coordinates ||
      !Array.isArray(address.coordinates) ||
      address.coordinates.length !== 2
    ) {
      return res
        .status(400)
        .json({ message: "Dữ liệu vị trí (location) không hợp lệ!" });
    }

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
      address: {
        type: address.type || "Point", // Đảm bảo type là "Point"
        coordinates: [
          parseFloat(address.coordinates[0]),
          parseFloat(address.coordinates[1]),
        ], // Chuyển thành số
      },
      location,
      contact_info,
      email,
      password: hashedPassword,
      avatar: avatarUrl,
      status: "pending",
    });

    await newBusiness.save();
    await sendBusinessVerificationEmail(newBusiness);

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
        address: newBusiness.address,
        avatar: newBusiness.avatar,
        open_hours: newBusiness.open_hours,
        close_hours: newBusiness.close_hours,
      },
      redirectTo: `/payment/activation/${newBusiness._id}`,
    });
  } catch (error) {
    console.error("Error in signupBusiness:", error);
    res.status(500).json({ message: error.message });
  }
};

// Xử lý thanh toán kích hoạt
const processActivationPayment = async (req, res) => {
  const { businessId } = req.params;
  const { paymentMethodId, amount, planType } = req.body;

  try {
    // Kiểm tra đầu vào
    if (!amount || isNaN(amount) || amount <= 0) {
      return res.status(400).json({ message: "Số tiền không hợp lệ." });
    }

    if (!planType || !["monthly", "yearly"].includes(planType)) {
      return res.status(400).json({ message: "Loại gói không hợp lệ." });
    }

    const business = await Business.findById(businessId);
    if (!business) {
      return res.status(404).json({ message: "Không tìm thấy tài khoản" });
    }

    // Tạo PaymentIntent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount / 250), // Số tiền tính bằng cent (USD)
      currency: "usd",
      payment_method: paymentMethodId,
      confirm: true,
      automatic_payment_methods: {
        enabled: true,
        allow_redirects: "never",
      },
    });

    if (paymentIntent.status === "succeeded") {
      // Tạo hoặc lấy khách hàng trong Stripe
      let customer;
      const existingCustomers = await stripe.customers.list({
        email: business.email,
        limit: 1,
      });

      if (existingCustomers.data.length > 0) {
        customer = existingCustomers.data[0];
      } else {
        customer = await stripe.customers.create({
          email: business.email,
          name: business.business_name,
          metadata: { businessId: business._id.toString() },
        });
      }

      // Tạo hóa đơn trong Stripe
      const invoice = await stripe.invoices.create({
        customer: customer.id,
        collection_method: "send_invoice",
        due_date: Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60,
        metadata: { paymentIntentId: paymentIntent.id },
      });

      // Thêm mục vào hóa đơn
      await stripe.invoiceItems.create({
        customer: customer.id,
        invoice: invoice.id,
        amount: paymentIntent.amount,
        currency: paymentIntent.currency,
        description: `Thanh toán phí kích hoạt (${planType === "yearly" ? "Gói năm" : "Gói tháng"}) cho ${business.business_name}`,
      });

      // Hoàn thiện hóa đơn
      const finalizedInvoice = await stripe.invoices.finalizeInvoice(invoice.id);

      // Cập nhật trạng thái Business
      const isActivation = business.status === "suspended" || !business.activationPayment;

      business.status = "active";
      business.lastPaymentDate = new Date();
      business.nextPaymentDueDate = new Date(
        business.lastPaymentDate.getTime() +
        (planType === "yearly" ? 365 : 30) * 24 * 60 * 60 * 1000
      );
      if (isActivation) {
        business.activationPayment = true;
      }
      business.reminderSent = false;
      await business.save();

      // Lưu thông tin thanh toán và hóa đơn
      const payment = new Payment({
        businessId: business._id,
        businessName: business.business_name,
        amount: amount,
        paymentId: paymentIntent.id,
        customerId: customer.id,
        customerEmail: customer.email,
        invoicePdf: finalizedInvoice.invoice_pdf,
      });
      await payment.save();

      res.status(200).json({
        message: isActivation
          ? "Thanh toán thành công! Tài khoản đã được kích hoạt."
          : "Thanh toán thành công! Gói đã được gia hạn.",
        amount: amount,
        paymentId: payment._id,
        invoiceId: finalizedInvoice.id,
        invoicePdf: finalizedInvoice.invoice_pdf,
        business: {
          id: business._id,
          business_name: business.business_name,
          email: business.email,
          lastPaymentDate: business.lastPaymentDate,
          nextPaymentDueDate: business.nextPaymentDueDate,
          status: business.status,
        },
      });
    } else {
      return res.status(400).json({
        message: "Thanh toán chưa hoàn tất.",
        status: paymentIntent.status,
      });
    }
  } catch (error) {
    console.error("Error in processActivationPayment:", error.message, error.stack);

    // Xử lý lỗi cụ thể từ Stripe
    let errorMessage = "Đã xảy ra lỗi trong quá trình thanh toán.";
    let statusCode = 500;

    if (error.type === "StripeCardError" || error.code) {
      statusCode = 400; // Lỗi từ phía người dùng
      switch (error.code) {
        case "card_declined":
          if (error.decline_code === "insufficient_funds") {
            errorMessage = "Thẻ không đủ số dư để thực hiện thanh toán.";
          } else if (error.decline_code === "lost_card") {
            errorMessage = "Thẻ đã bị báo mất.";
          } else if (error.decline_code === "stolen_card") {
            errorMessage = "Thẻ bị nghi ngờ là thẻ bị đánh cắp.";
          } else {
            errorMessage = "Thẻ của bạn bị từ chối.";
          }
          break;
        case "incorrect_cvc":
          errorMessage = "Mã CVC không đúng.";
          break;
        case "expired_card":
          errorMessage = "Thẻ của bạn đã hết hạn.";
          break;
        case "invalid_card_number":
          errorMessage = "Số thẻ không hợp lệ.";
          break;
        case "processing_error":
          errorMessage = "Lỗi xử lý từ ngân hàng. Vui lòng thử lại sau.";
          break;
        default:
          errorMessage = error.message || "Lỗi không xác định từ Stripe.";
      }
    }

    res.status(statusCode).json({ message: errorMessage });
  }
};
// Xử lý thanh toán phí duy trì
const processMonthlyPayment = async (req, res) => {
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

    // Tạo thanh toán qua Stripe
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount / 250), // Số tiền tính bằng cent (USD)
      currency: "usd",
      payment_method: paymentMethodId,
      confirm: true,
      automatic_payment_methods: {
        enabled: true,
        allow_redirects: "never",
      },
    });

    if (paymentIntent.status === "succeeded") {
      // Tạo hoặc lấy khách hàng trong Stripe
      let customer;
      const existingCustomers = await stripe.customers.list({
        email: business.email,
        limit: 1,
      });

      if (existingCustomers.data.length > 0) {
        customer = existingCustomers.data[0];
      } else {
        customer = await stripe.customers.create({
          email: business.email,
          name: business.business_name,
          metadata: { businessId: business._id.toString() },
        });
      }

      // Tạo hóa đơn trong Stripe
      const invoice = await stripe.invoices.create({
        customer: customer.id,
        collection_method: "send_invoice",
        due_date: Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60, // Hạn thanh toán sau 7 ngày
        metadata: { paymentIntentId: paymentIntent.id },
      });

      // Thêm mục vào hóa đơn
      await stripe.invoiceItems.create({
        customer: customer.id,
        invoice: invoice.id,
        amount: paymentIntent.amount, // Số tiền từ PaymentIntent (cent)
        currency: paymentIntent.currency,
        description: `Thanh toán phí duy trì (${planType === "yearly" ? "Gói năm" : "Gói tháng"}) cho ${business.business_name}`,
      });

      // Hoàn thiện hóa đơn
      const finalizedInvoice = await stripe.invoices.finalizeInvoice(invoice.id);

      // Cập nhật trạng thái Business
      business.lastPaymentDate = new Date();
      business.nextPaymentDueDate = new Date(
        business.lastPaymentDate.getTime() +
        (planType === "yearly" ? 365 : 30) * 24 * 60 * 60 * 1000
      );
      business.status = "active";
      business.reminderSent = false; // Đặt lại reminderSent
      await business.save();

      // Lưu thông tin thanh toán và hóa đơn vào bảng Payment
      const payment = new Payment({
        businessId: business._id,
        businessName: business.business_name,
        amount: amount, // Số tiền gốc (VND)
        paymentId: paymentIntent.id,
        customerId: customer.id,
        customerEmail: customer.email,
        invoicePdf: finalizedInvoice.invoice_pdf, // Link PDF của hóa đơn
        type: "renewal",
      });
      await payment.save();

      res.status(200).json({
        message: "Thanh toán phí duy trì thành công!",
        amount: amount,
        paymentId: payment._id,
        invoiceId: finalizedInvoice.id,
        invoicePdf: finalizedInvoice.invoice_pdf,
        business: {
          id: business._id,
          business_name: business.business_name,
          email: business.email,
          lastPaymentDate: business.lastPaymentDate,
          nextPaymentDueDate: business.nextPaymentDueDate,
          status: business.status,
        },
      });
    } else {
      res.status(400).json({
        message: "Thanh toán chưa hoàn tất.",
        status: paymentIntent.status,
      });
    }
  } catch (error) {
    console.error("Error in processMonthlyPayment:", error.message, error.stack);

    // Xử lý lỗi cụ thể từ Stripe
    let errorMessage = "Đã xảy ra lỗi trong quá trình thanh toán.";
    let statusCode = 500;

    if (error.type === "StripeCardError" || error.code) {
      statusCode = 400; // Lỗi từ phía người dùng
      switch (error.code) {
        case "card_declined":
          if (error.decline_code === "insufficient_funds") {
            errorMessage = "Thẻ không đủ số dư để thực hiện thanh toán.";
          } else if (error.decline_code === "lost_card") {
            errorMessage = "Thẻ đã bị báo mất.";
          } else if (error.decline_code === "stolen_card") {
            errorMessage = "Thẻ bị nghi ngờ là thẻ bị đánh cắp.";
          } else {
            errorMessage = "Thẻ của bạn bị từ chối.";
          }
          break;
        case "incorrect_cvc":
          errorMessage = "Mã CVC không đúng.";
          break;
        case "expired_card":
          errorMessage = "Thẻ của bạn đã hết hạn.";
          break;
        case "invalid_card_number":
          errorMessage = "Số thẻ không hợp lệ.";
          break;
        case "processing_error":
          errorMessage = "Lỗi xử lý từ ngân hàng. Vui lòng thử lại sau.";
          break;
        default:
          errorMessage = error.message || "Lỗi không xác định từ Stripe.";
      }
    }

    res.status(statusCode).json({ message: errorMessage });
  }
};
//Đăng nhập
const loginBusiness = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    // Tìm business theo email
    const business = await Business.findOne({ email });
    if (!business) {
      return res.status(404).json({
        status: "NOT_FOUND",
        message: "Tài khoản không tồn tại",
      });
    }
    if (!business.verified) {
      return res.status(403).json({
        status: "FAILED",
        message: "Email chưa được xác minh. Vui lòng kiểm tra hộp thư của bạn.",
      });
    }

    // Kiểm tra mật khẩu
    const isMatch = await bcrypt.compare(password, business.password);
    if (!isMatch) {
      return res.status(400).json({
        status: "PASSWORDINCORRECT",
        message: "Mật khẩu không chính xác",
      });
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
        createdAt: business.createdAt,
        lastPaymentDate: business.lastPaymentDate,
        nextPaymentDueDate: business.nextPaymentDueDate,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      status: "SERVER_ERROR",
      message: "Internal Server Error",
    });
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

const updateTotalReviews = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updatedBusiness = await updateTotalReviewsService(id);
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

    if (
      !resetToken ||
      !resetToken.businessId ||
      resetToken.expiresAt < Date.now()
    ) {
      return res
        .status(400)
        .json({ message: "Token không hợp lệ hoặc đã hết hạn!" });
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
      return res.status(400).json({
        message: "Không tìm thấy người dùng, đặt lại mật khẩu thất bại!",
      });
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
//Lấy danh sách hóa đơn
const getBilling = async (req, res) => {
  const { businessId } = req.params;

  try {

    const payments = await Payment.find({ businessId }).sort({ paymentDate: -1 });


    const stripeInvoices = await stripe.invoices.list({
      customer: payments[0]?.customerId,
      limit: 100,
    });


    const billingData = payments.map((payment) => ({
      paymentId: payment.paymentId,
      amount: payment.amount,
      paymentDate: payment.paymentDate,
      businessName: payment.businessName,
      invoicePdf: payment.invoicePdf || null,
      status: "active",
    }));

    res.status(200).json(billingData);
  } catch (error) {
    console.error("Error fetching billing data:", error);
    res.status(500).json({ message: "Lỗi khi lấy danh sách hóa đơn" });
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
  updateTotalReviews,
  processActivationPayment,
  processMonthlyPayment,
  requestBusinessPasswordReset,
  resetBusinessPassword,
  getBusinessEmail,
  getBilling
};
