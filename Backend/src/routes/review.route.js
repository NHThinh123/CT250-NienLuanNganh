const express = require("express");
const {
  getListReview,
  getReviewById,
  createReview,
  deleteReview,
  getReviewsByBusinessId,
  getNumberOfReviewsByBusinessId,
} = require("../controllers/review.controller");

const router = express.Router();

router.get("/", getListReview); // Lấy danh sách review, hỗ trợ tìm kiếm & phân trang
router.get("/getReviewsByBusinessId/:id", getReviewsByBusinessId); //Lấy danh sách review theo business_id
router.get(
  "/getNumberOfReviewsByBusinessId/:id",
  getNumberOfReviewsByBusinessId
);
router.get("/:id", getReviewById); // Lấy chi tiết một review theo ID
router.post("/", createReview); // Tạo mới một review
router.delete("/:id", deleteReview); // Xóa mềm review theo ID

module.exports = router;
