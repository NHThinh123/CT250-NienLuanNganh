const express = require("express");
const { helloUser } = require("../controllers/user.controller");
const router = express.Router();

//Public routes
router.get("/", helloUser);

module.exports = router;
