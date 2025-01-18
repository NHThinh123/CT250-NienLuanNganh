const express = require("express");
const {
  helloUser,
  createUser,
  getListUser,
} = require("../controllers/user.controller");
const router = express.Router();

//Public routes
router.get("/", getListUser);
router.get("/hello", helloUser);
router.post("/register", createUser);

module.exports = router;
