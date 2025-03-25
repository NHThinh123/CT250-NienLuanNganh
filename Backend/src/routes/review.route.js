const express = require("express");
const {
  getListReview,
  getReviewById,
  createReview,
  deleteReview,
  getReviewsByBusinessId,
  getNumberOfReviewsByBusinessId,
  getReviewResponseByParentReviewId,
} = require("../controllers/review.controller");
const uploadReview = require("../middleware/uploadReview");

const router = express.Router();

router.get("/", getListReview); // Lấy danh sách review, hỗ trợ tìm kiếm & phân trang
router.get("/getReviewsByBusinessId/:id", getReviewsByBusinessId); //Lấy danh sách review theo business_id
router.get(
  "/getReviewResponseByParentReviewId/:id",
  getReviewResponseByParentReviewId
); //Lấy danh sách phản hồi review theo parent_review_id
router.get(
  "/getNumberOfReviewsByBusinessId/:id",
  getNumberOfReviewsByBusinessId
);
router.get("/:id", getReviewById); // Lấy chi tiết một review theo ID
router.post("/", uploadReview.array("media", 5), createReview); // Tạo mới một review
router.delete("/:id", deleteReview); // Xóa mềm review theo ID

module.exports = router;
