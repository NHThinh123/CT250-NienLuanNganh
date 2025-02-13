const express = require("express");
const {
  getListMenu,
  getMenuById,
  createMenu,
  updateMenu,
  deleteMenu,
} = require("../controllers/menu.controller");

const router = express.Router();

router.get("/", getListMenu); // Hỗ trợ tìm kiếm & phân trang
router.post("/", createMenu);
router.get("/:id", getMenuById);
router.put("/:id", updateMenu);
router.delete("/:id", deleteMenu);

module.exports = router;
