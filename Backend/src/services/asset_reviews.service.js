const Asset_Reviews = require("../models/asset_reviews.model");

const getAssetReviewByBusinessId = async (business_id) => {
  try {
    return await Asset_Reviews.find({ business_id, deleted: false });
  } catch (error) {
    throw new Error(error.message);
  }
};

const getAssetReviewByReviewId = async (review_id) => {
  try {
    return await Asset_Reviews.find({ review_id, deleted: false });
  } catch (error) {
    throw new Error(error.message);
  }
};

module.exports = {
  getAssetReviewByBusinessId,
  getAssetReviewByReviewId,
};
