const express = require("express");
const {
  likePost,
  unlikePost,
  getUserLikePost,
  getPostLikeByUser,
} = require("../controllers/user_like_post.controller");

const router = express.Router();

//Public routes
router.post("/like", likePost);
router.delete("/unlike", unlikePost);
router.get("/user/:post_id", getUserLikePost);
router.get("/post/:user_id", getPostLikeByUser);

module.exports = router;
