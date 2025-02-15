const express = require("express");
const {
  likePost,
  unlikePost,
  getUserLikePost,
  getPostLikeByUser,
} = require("../controllers/user_like_post.controller");

const router = express.Router();

//Public routes
router.put("/like", likePost);
router.put("/unlike", unlikePost);
router.get("/user/:post_id", getUserLikePost);
router.get("/post/:user_id", getPostLikeByUser);

module.exports = router;
