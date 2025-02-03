const express = require("express");
const {
  getListPost,
  getPostById,
  createPost,
  updatePost,
  deletePost,
} = require("../controllers/post.controller");

const router = express.Router();

//Public routes
router.get("/", getListPost);
router.get("/:id", getPostById);
router.post("/create", createPost);
router.put("/:id", updatePost);
router.delete("/:id", deletePost);

module.exports = router;
