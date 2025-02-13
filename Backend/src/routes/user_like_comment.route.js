const express = require("express");
const {
  likeComment,
  unlikeComment,
  getUserLikeComment,
  getCommentLikeByUser,
} = require("../controllers/user_like_comment.controller");

const router = express.Router();

//Public routes
router.post("/like", likeComment);
router.delete("/unlike", unlikeComment);
router.get("/user/:comment_id", getUserLikeComment);
router.get("/comment/:user_id", getCommentLikeByUser);

module.exports = router;
