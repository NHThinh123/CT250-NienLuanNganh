const assetReviewsService = require("../services/asset_reviews.service");

const getAssetReviewByBusinessId = async (req, res, next) => {
  try {
    const { business_id } = req.params;
    const assetReviews = await assetReviewsService.getAssetReviewByBusinessId(
      business_id
    );
    res.status(200).json(assetReviews);
  } catch (error) {
    next(error);
  }
};

const getAssetReviewByReviewId = async (req, res, next) => {
  try {
    const { review_id } = req.params;
    const assetReviews = await assetReviewsService.getAssetReviewByReviewId(
      review_id
    );
    res.status(200).json(assetReviews);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAssetReviewByBusinessId,
  getAssetReviewByReviewId,
};
