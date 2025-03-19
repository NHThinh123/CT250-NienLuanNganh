const express = require("express");
const {
  getListPost,
  getPostById,
  createPost,
  updatePost,
  deletePost,
  getMyPosts,
  getLikedPosts,
  getCommentedPosts,
  getPostFrequency,
  getPostSummary,
} = require("../controllers/post.controller");
const uploadPost = require("../middleware/uploadPost");

const router = express.Router();

//Public routes
router.get("/", getListPost);
router.get("/my-posts", getMyPosts);
router.get("/liked-posts", getLikedPosts);
router.get("/commented-posts", getCommentedPosts);
router.get("/detail/:id", getPostById);
router.post("/create", uploadPost.array("media", 5), createPost);
router.patch("/:post_id", uploadPost.array("media", 5), updatePost);
router.delete("/:post_id", deletePost);
router.get("/frequency", getPostFrequency);
router.get("/summary", getPostSummary);

module.exports = router;
