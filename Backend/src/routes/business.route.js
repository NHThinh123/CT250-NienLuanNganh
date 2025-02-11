const express = require("express");
const { createBusiness, updateBusiness, getBusiness, getBusinessById, signupBusiness, loginBusiness } = require("../controllers/business.controller");
const router = express.Router();

router.post('/', createBusiness);
router.get('/', getBusiness);
router.get('/id/:id', getBusinessById);
router.put('/id/:id', updateBusiness);
router.post('/signupBusiness', signupBusiness);
router.post('/loginBusiness', loginBusiness);

module.exports = router;