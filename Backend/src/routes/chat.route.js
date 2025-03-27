
const express = require("express");
const router = express.Router();
const { sendMessage, getMessages, markAsRead, getBusinessesForUser, getUsersForBusiness } = require("../controllers/chat.controller");

router.post("/messages", sendMessage);
router.get("/messages/:userId/:businessId", getMessages);
router.put("/messages/:messageId/read", markAsRead);
router.get("/businesses/:userId", getBusinessesForUser);
router.get("/users/:businessId", getUsersForBusiness);

module.exports = router;