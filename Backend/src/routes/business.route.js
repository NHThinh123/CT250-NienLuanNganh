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
  processActivationPayment,
  processMonthlyPayment,
} = require("../controllers/business.controller");
const router = express.Router();
const upload = require("../middleware/uploadAvatar");
const { checkAccountStatus } = require("../middleware/checkBusiness");

// router.post("/", createBusiness);
router.get("/", getBusiness);
router.get("/id/:id", getBusinessById);
router.put("/id/:id", upload.single("avatar"), updateBusiness);
router.post("/signupBusiness", upload.single("avatar"), signupBusiness);
router.post("/payment/activation/:businessId", processActivationPayment);
router.post("/payment/monthly/:businessId", processMonthlyPayment);
router.post("/loginBusiness", checkAccountStatus, loginBusiness);
router.put("/updateRatingAverage/:id", updateRatingAverage);
router.put("/updateDishCost/:id", updateDishCostBusiness);

module.exports = router;
