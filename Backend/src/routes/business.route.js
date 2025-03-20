const express = require("express");
const {
  // createBusiness,
  updateBusiness,
  getBusiness,
  getBusinessById,
  signupBusiness,
  loginBusiness,
  updateRatingAverage,
  updateDishCostBusiness,
  updateTotalReviews,
  processActivationPayment,
  processMonthlyPayment,
  requestBusinessPasswordReset,
  resetBusinessPassword,
  getBusinessEmail,
} = require("../controllers/business.controller");
const router = express.Router();
const upload = require("../middleware/uploadAvatar");
const path = require("path");
const { verifyBusinessEmail } = require("../controllers/user.verifiEmail");
const Business = require("../models/business.model");

// router.post("/", createBusiness);
router.get("/", getBusiness);
//Xác thực tài khoản
router.get("/verify/:businessId/:uniqueString", verifyBusinessEmail);
router.get("/verified", (req, res) => {
  try {
    res.sendFile(path.join(__dirname, "../views/verification.html"));
  } catch (error) {
    console.error("Error sending verification page:", error);
    res.status(500).send("Internal Server Error");
  }
});
//Gửi yêu cầu đặt lại mật khẩu
router.post("/reset-password-request", requestBusinessPasswordReset);

router.get("/reset-password/:token", (req, res) => {
  res.sendFile(path.join(__dirname, "../views/reset-business-password.html"));
});
//Đặt lại mật khẩu
router.post("/reset-password/:token", resetBusinessPassword);
//Lấy email
router.get("/get-email/:token", getBusinessEmail);
router.post("/", async (req, res) => {
  try {
    const newUser = await Business.create(req.body);
    // Gửi thông báo qua WebSocket khi user mới được tạo
    req.app.get("notifyBusinessrStats")();
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ message: "Error creating user", error });
  }
});

router.get("/id/:id", getBusinessById);
router.put("/id/:id", upload.single("avatar"), updateBusiness);
router.post("/signupBusiness", upload.single("avatar"), signupBusiness);
router.post("/payment/activation/:businessId", processActivationPayment);
router.post("/payment/monthly/:businessId", processMonthlyPayment);
router.post("/loginBusiness", loginBusiness);
router.put("/updateRatingAverage/:id", updateRatingAverage);
router.put("/updateDishCost/:id", updateDishCostBusiness);
router.put("/updateTotalReviews/:id", updateTotalReviews);

module.exports = router;
