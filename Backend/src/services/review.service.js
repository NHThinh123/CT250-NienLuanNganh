const Review = require("../models/review.model");
const Asset_Reviews = require("../models/asset_reviews.model");

const getListReviewService = async (page = 1, limit = 10, search = "") => {
  const skip = (page - 1) * limit;
  const query = search
    ? { review_contents: { $regex: search, $options: "i" } }
    : {};

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

const createReviewService = async (
  business_id,
  review_rating,
  review_contents,
  user_id,
  business_id_review,
  parent_review_id,
  business_id_feedback,
  files
) => {
  // Đảm bảo chỉ có một trong hai trường `user_id` hoặc `business_id_review`
  if (user_id && business_id_review && business_id_feedback) {
    throw new AppError(
      "Only one of user_id, business_id_review or business_id_feedback should be provided.",
      400
    );
  }
  if (!user_id && !business_id_review && !business_id_feedback) {
    throw new AppError(
      "One of user_id, business_id_feedback or business_id_review is required.",
      400
    );
  }

  let result = await Review.create({
    business_id: business_id,
    review_rating: review_rating || null,
    review_contents: review_contents || "",
    user_id: user_id || null,
    business_id_review: business_id_review || null,
    parent_review_id: parent_review_id || null,
    business_id_feedback: business_id_feedback || null,
  });

  if (files && files.length > 0) {
    const mediaDocs = files.map((file) => {
      let type = file.mimetype.startsWith("image/")
        ? "image"
        : file.mimetype.startsWith("video/")
        ? "video"
        : null;
      if (!type) throw new AppError("Unsupported file type", 400);
      return {
        review_id: result._id,
        business_id: result.business_id,
        type,
        url: file.path,
      };
    });
    await Asset_Reviews.insertMany(mediaDocs);
  }

  return result;
};

// const updateReviewService = async (id, dataUpdate) => {
//   return await Review.findByIdAndUpdate(id, dataUpdate, { new: true });
// };

const deleteReviewService = async (id) => {
  return await Review.delete({ _id: id });
};

const getReviewsByBusinessIdService = async (businessId) => {
  try {
    const reviews = await Review.find({ business_id: businessId })
      .populate("user_id", "avatar name")
      .populate("business_id_review", "business_name avatar");
    return reviews;
  } catch (error) {
    throw new Error(error.message);
  }
};

const getReviewResponseByParentReviewIdService = async (parent_review_id) => {
  try {
    const reviews = await Review.find({ parent_review_id: parent_review_id })
      .populate("user_id", "avatar name")
      .populate("business_id_review", "business_name avatar")
      .populate("business_id_feedback", "business_name avatar");

    return reviews;
  } catch (error) {
    throw new Error(error.message);
  }
};

const getNumberOfReviewsByBusinessIdService = async (businessId) => {
  try {
    const totalReviews = await Review.countDocuments({
      business_id: businessId,
    });
    return totalReviews;
  } catch (error) {
    throw new Error(error.mesage);
  }
};

module.exports = {
  getListReviewService,
  getReviewByIdService,
  createReviewService,
  getNumberOfReviewsByBusinessIdService,
  deleteReviewService,
  getReviewsByBusinessIdService,
  getReviewResponseByParentReviewIdService,
};
