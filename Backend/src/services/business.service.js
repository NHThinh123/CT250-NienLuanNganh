const { get } = require("../config/emailConfig");
const Business = require("../models/business.model");
const Review = require("../models/review.model");

// const createBusinessService = async (req, res) => {
//   const {
//     business_name,
//     open_hours,
//     close_hours,
//     location,
//     contact_info,
//     email,
//     password,
//   } = req.body;
//   const business = new Business({
//     business_name,
//     open_hours,
//     close_hours,
//     location,
//     contact_info,
//     email,
//     password,
//   });
//   try {
//     const savedBusiness = await business.save();
//     res.json(savedBusiness);
//   } catch (error) {
//     res.status(400).json({ message: error });
//   }
// };
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

module.exports = {
  // createBusinessService,
  getBusinessService,
  getBusinessByIdService,
  updateBusinessService,
  updateRatingAverageService,
};
