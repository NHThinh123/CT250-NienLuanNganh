const express = require("express");
const {
  getListDish,
  getDishById,
  createDish,
  updateDish,
  deleteDish,
} = require("../controllers/dish.controller");

const router = express.Router();

router.get("/", getListDish); // Hỗ trợ tìm kiếm & phân trang
router.post("/", createDish);
router.get("/:id", getDishById);
router.put("/:id", updateDish);
router.delete("/:id", deleteDish);

module.exports = router;
