const express = require("express");
const router = express.Router();
const {
    getAllUsers,
    createUser,
    updateUser,
    deleteUser,
    getAllBusinesses,
    createBusiness,
    updateBusiness,
    deleteBusiness,
    TotalPayment
} = require("../controllers/admin.controller");
const { protect, adminOnly } = require("../middleware/admin");

// Quản lý Users
router.get("/users", protect, adminOnly, getAllUsers);
router.post("/create/users", protect, adminOnly, createUser);
router.put("/users/:id", protect, adminOnly, updateUser);
router.delete("/users/:id", protect, adminOnly, deleteUser);

// Quản lý Businesses
router.get("/businesses", protect, adminOnly, getAllBusinesses);
router.post("/create/businesses", protect, adminOnly, createBusiness);
router.put("/businesses/:id", protect, adminOnly, updateBusiness);
router.delete("/businesses/:id", protect, adminOnly, deleteBusiness);
//Lấy tổng doanh thu
router.get("/total-revenue", protect, adminOnly, TotalPayment);

module.exports = router;