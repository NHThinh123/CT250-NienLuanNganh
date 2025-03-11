const express = require("express");
const {
  getListPost,
  getPostById,
  createPost,
  updatePost,
  deletePost,
  getMyPosts,
} = require("../controllers/post.controller");
const uploadPost = require("../middleware/uploadPost");

const router = express.Router();

//Public routes
router.get("/", getListPost);
router.get("/my-posts", getMyPosts);
router.get("/detail/:id", getPostById);
router.post("/create", uploadPost.array("media", 5), createPost);
router.put("/:id", updatePost);
router.delete("/:id", deletePost);

module.exports = router;
