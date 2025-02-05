const express = require("express");
const {
  getListTag,
  createTag,
  deleteTag,
} = require("../controllers/tag.controller");
const router = express.Router();

//Public routes
router.get("/", getListTag);
router.post("/create", createTag);
router.delete("/:id", deleteTag);

module.exports = router;
