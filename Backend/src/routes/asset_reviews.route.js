const express = require("express");
const router = express.Router();
const {
  getAssetReviewByBusinessId,
  getAssetReviewByReviewId,
} = require("../controllers/asset_reviews.controller");

// Route để lấy asset reviews theo business_id
router.get(
  "/getAssetReviewByBusinessId/:business_id",
  getAssetReviewByBusinessId
);

// Route để lấy asset reviews theo review_id
router.get("/getAssetReviewByReviewId/:review_id", getAssetReviewByReviewId);

module.exports = router;
