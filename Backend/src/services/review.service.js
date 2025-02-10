const Review = require("../models/review.model");

const getListReviewService = async (page = 1, limit = 10, search = "") => {
  const skip = (page - 1) * limit;
  const query = search ? { review_contents: { $regex: search, $options: "i" } } : {};

  const reviews = await Review.find(query)
    .populate("user_id", "user_name email") // Lấy thông tin user liên quan
    .populate("business_id", "business_name") // Lấy thông tin business liên quan
    .skip(skip)
    .limit(limit);
  const total = await Review.countDocuments(query);

  return {
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
    data: reviews,
  };
};

const getReviewByIdService = async (id) => {
  return await Review.findById(id)
    .populate("user_id", "user_name email")
    .populate("business_id", "business_name");
};

const createReviewService = async (reviewData) => {
  return await Review.create(reviewData);
};

const updateReviewService = async (id, dataUpdate) => {
  return await Review.findByIdAndUpdate(id, dataUpdate, { new: true });
};

const deleteReviewService = async (id) => {
  return await Review.delete({ _id: id });
};

module.exports = {
  getListReviewService,
  getReviewByIdService,
  createReviewService,
  updateReviewService,
  deleteReviewService,
};
