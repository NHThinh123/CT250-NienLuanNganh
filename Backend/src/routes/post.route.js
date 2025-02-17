const express = require("express");
const {
  getListPost,
  getPostById,
  createPost,
  updatePost,
  deletePost,
} = require("../controllers/post.controller");
const uploadPost = require("../middleware/uploadPost");
const router = express.Router();

//Public routes
router.get("/:user_id", getListPost);
router.get("/:id", getPostById);
router.post("/create", uploadPost.array("images", 5), createPost);
router.put("/:id", updatePost);
router.delete("/:id", deletePost);

module.exports = router;
