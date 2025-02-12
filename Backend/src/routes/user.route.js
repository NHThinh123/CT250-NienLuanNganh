const express = require("express");
const router = express.Router();
const path = require('path');
const { signup, signin } = require("../controllers/user.controller");
const { verifyEmail } = require("../controllers/user.verifiEmail");

router.post("/signup", signup);
router.get("/verify/:userId/:uniqueString", verifyEmail);

router.get('/verified', (req, res) => {
  const { error, message } = req.query;
  if (error) {
    return res.send(`<h1>Error: ${message}</h1>`);
  }
  //res.sendFile(path.join(__dirname, "./../views/verification.html"));  // Kiểm tra đường dẫn này
  res.sendFile(path.resolve("views", "verification.html"));

});


router.post("/login", signin);

module.exports = router;
