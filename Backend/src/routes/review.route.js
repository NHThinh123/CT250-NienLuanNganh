const express = require("express");
const {
  getListReview,
  getReviewById,
  createReview,
  // updateReview,
  deleteReview,
} = require("../controllers/review.controller");

const router = express.Router();

router.get("/", getListReview); // Lấy danh sách review, hỗ trợ tìm kiếm & phân trang
router.get("/:id", getReviewById); // Lấy chi tiết một review theo ID
router.post("/", createReview); // Tạo mới một review
// router.put("/:id", updateReview); // Cập nhật review theo ID
router.delete("/:id", deleteReview); // Xóa mềm review theo ID

module.exports = router;
