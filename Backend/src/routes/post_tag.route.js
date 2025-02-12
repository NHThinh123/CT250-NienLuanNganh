const express = require("express");
const {
  addTagToPost,
  getPostByTag,
  getTagByPost,
  deleteTagFromPost,
} = require("../controllers/post_tag.controller");

const router = express.Router();

//Public routes
router.post("/add", addTagToPost);
router.get("/posts/:tag_id", getPostByTag);
router.get("/tags/:post_id", getTagByPost);
router.delete("/delete", deleteTagFromPost);

module.exports = router;
