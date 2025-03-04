const { get } = require("../config/emailConfig");
const Business = require("../models/business.model");
const payment = require("../models/payment.model");
const transporter = require("../config/emailConfig");
const Review = require("../models/review.model");


const getBusinessService = async (req, res) => {
  try {
    const business = await Business.find();
    return business;
  } catch (error) {
    res.status(400).json({ message: error });
  }
};
// lấy id business
const getBusinessByIdService = async (id) => {
  try {
    const business = await Business.findById(id);
    if (!business) {
      throw new Error("Business not found");
    }
    return business;
  } catch (error) {
    throw new Error(error.message);
  }
};

//cập nhật thông tin business
const updateBusinessService = async (id, updateData) => {
  try {
    const updatedBusiness = await Business.findByIdAndUpdate(id, updateData, {
      new: true,
    });
    if (!updatedBusiness) {
      throw new Error("Business không tồn tại");
    }
    return updatedBusiness;
  } catch (error) {
    throw new Error(error.message);
  }
};

const updateRatingAverageService = async (businessId) => {
  try {
    const reviews = await Review.find({ business_id: businessId });
    if (reviews.length === 0) {
      throw new Error("No reviews found for this business");
    }

    const totalRating = reviews.reduce(
      (sum, review) => sum + review.review_rating,
      0
    );
    let ratingAverage = totalRating / reviews.length;
    ratingAverage = Math.round(ratingAverage * 10) / 10;

    const updatedBusiness = await Business.findByIdAndUpdate(
      businessId,
      { rating_average: ratingAverage },
      { new: true }
    );

    if (!updatedBusiness) {
      throw new Error("Business not found");
    }

    return updatedBusiness;
  } catch (error) {
    throw new Error(error.message);
  }
};
//Gửi email nhắc nhở thanh toán
const sendPaymentReminder = async (email, business_name, dueDate, businessId) => {
  const paymentLink = `http://localhost:8080/api/businesss/payment/monthly/${businessId}`;
  const mailOptions = {
    from: process.env.AUTH_EMAIL,
    to: email,
    subject: "Nhắc nhở thanh toán phí duy trì tài khoản Yumzy",
    text: `Kính gửi ${business_name},\n\nPhí duy trì tài khoản của bạn sẽ đến hạn vào ngày ${dueDate.toLocaleDateString("vi-VN")}. Vui lòng thanh toán trước hạn: ${paymentLink}\n\nTrân trọng,\nĐội ngũ hỗ trợ`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Đã gửi email nhắc nhở đến ${email}`);
  } catch (error) {
    console.error(`Lỗi gửi email đến ${email}:`, error);
  }
};

module.exports = {
  // createBusinessService,
  getBusinessService,
  getBusinessByIdService,
  updateBusinessService,
  updateRatingAverageService,
  sendPaymentReminder
};
