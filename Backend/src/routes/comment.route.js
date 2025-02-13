const express = require("express");
const {
  createComment,
  getCommentById,
  getReplyByComment,
  getListCommentByPost,
  updateComment,
  deleteComment,
} = require("../controllers/comment.controller");
const router = express.Router();

//Public routes
router.post("/create", createComment);
router.get("/post/:post_id", getListCommentByPost);
router.get("/reply/:comment_id", getReplyByComment);
router.get("/:id", getCommentById);
router.put("/:id", updateComment);
router.delete("/:id", deleteComment);

module.exports = router;
