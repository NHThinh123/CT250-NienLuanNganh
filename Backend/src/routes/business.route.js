const express = require("express");
const { createBusiness, updateBusiness, getBusiness, getBusinessById, signupBusiness, loginBusiness } = require("../controllers/business.controller");
const router = express.Router();
const upload = require("../middleware/uploadAvatar");

router.post('/', createBusiness);
router.get('/', getBusiness);
router.get('/id/:id', getBusinessById);
router.put('/id/:id', upload.single('avatar'), updateBusiness);
router.post('/signupBusiness', upload.single('avatar'), signupBusiness);
router.post('/loginBusiness', loginBusiness);

module.exports = router;