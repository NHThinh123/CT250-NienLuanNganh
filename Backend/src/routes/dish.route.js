const express = require("express");
const uploadDishes = require("../middleware/uploadDishes");
const {
  getListDish,
  getDishById,
  createDish,
  updateDish,
  searchDish,
  findByIdDish,
  findAllDish,
  getListDishByBusinessId,
  getDishesByMenuId,
  deleteDish,
} = require("../controllers/dish.controller");
const { get } = require("../config/emailConfig");

const router = express.Router();

router.get("/", getListDish); // Hỗ trợ tìm kiếm & phân trang
router.post("/", uploadDishes.array("dish_url", 5), createDish);
router.get("/getDishByMenuId/:id", getDishesByMenuId);
router.get("/getListDishByBusinessId/:id", getListDishByBusinessId);
router.get("/:id", getDishById);
router.put("/:id", uploadDishes.array("dish_url", 5), updateDish);
router.delete("/:id", deleteDish);

module.exports = router;
