const express = require("express");
const { helloUser, createUser } = require("../controllers/user.controller");
const router = express.Router();

//Public routes
router.get("/", helloUser);
router.post("/register", createUser);

module.exports = router;
