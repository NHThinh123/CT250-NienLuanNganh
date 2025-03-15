const { get } = require("../config/emailConfig");
const Business = require("../models/business.model");
const Dish = require("../models/dish.model");
const Menu = require("../models/menu.model");
const payment = require("../models/payment.model");
const transporter = require("../config/emailConfig");
const Review = require("../models/review.model");
const { getListDishByBusinessIdService } = require("./dish.service");

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

const getDishCostService = async (businessId) => {
  try {
    const dishes = await getListDishByBusinessIdService(businessId);

    if (dishes.length === 0) {
      throw new Error("No dishes found for this business");
    }

    const lowestCostDish = dishes.reduce((prev, curr) =>
      prev.dish_price < curr.dish_price ? prev : curr
    );
    const highestCostDish = dishes.reduce((prev, curr) =>
      prev.dish_price > curr.dish_price ? prev : curr
    );

    return {
      lowestCostDish,
      highestCostDish,
    };
  } catch (error) {
    throw new Error(error.message);
  }
};

const updateDishCostBusinessService = async (businessId) => {
  try {
    const { lowestCostDish, highestCostDish } = await getDishCostService(
      businessId
    );

    const updatedBusiness = await Business.findByIdAndUpdate(
      businessId,
      {
        dish_lowest_cost: lowestCostDish.dish_price,
        dish_highest_cost: highestCostDish.dish_price,
      },
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

const updateTotalReviews = async (businessId) => {
  try {
    const totalReviews = await Review.countDocuments({
      business_id: businessId,
    });
    await Business.findByIdAndUpdate(businessId, { totalReviews });
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
  updateDishCostBusinessService,
  updateTotalReviews,
};
