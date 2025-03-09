const express = require("express");
const uploadDishes = require("../middleware/uploadDishes");
const {
  getListDish,
  getDishById,
  createDish,
  updateDish,
  getListDishByBusinessId,
  getDishesByMenuId,
  deleteDish,
} = require("../controllers/dish.controller");
const { get } = require("../config/emailConfig");

const router = express.Router();

router.get("/", getListDish); // Hỗ trợ tìm kiếm & phân trang
// Upload nhiều ảnh
// router.post("/", uploadDishes.array("dish_url", 5), createDish);
router.post("/", uploadDishes.single("dish_url"), createDish);
router.get("/getDishByMenuId/:id", getDishesByMenuId);
router.get("/getListDishByBusinessId/:id", getListDishByBusinessId);
router.get("/:id", getDishById);
//Update nhiều ảnh
// router.put("/:id", uploadDishes.array("dish_url", 5), updateDish);
router.put("/:id", uploadDishes.single("dish_url"), updateDish);
router.delete("/:id", deleteDish);

module.exports = router;
