require("dotenv").config();

const mongoose = require("mongoose");
const AppError = require("../utils/AppError");
const Post_Tag = require("../models/post_tag.model");

const addTagToPostService = async (post_id, tag_id) => {
  let result = await Post_Tag.create({ post_id, tag_id });
  return result;
};

const getPostByTagService = async (tag_id) => {
  if (!mongoose.Types.ObjectId.isValid(tag_id)) {
    throw new AppError("Invalid tag ID", 400);
  }

  let result = await Post_Tag.find({ tag_id }).populate("post_id");

  return result.map((item) => item.post_id);
};

const getTagByPostService = async (post_id) => {
  if (!mongoose.Types.ObjectId.isValid(post_id)) {
    throw new AppError("Invalid post ID", 400);
  }

  let result = await Post_Tag.find({ post_id }).populate("tag_id");

  return result.map((item) => item.tag_id);
};

const deleteTagFromPostService = async (post_id, tag_id) => {
  let result = await Post_Tag.deleteOne({ post_id, tag_id });
  return result;
};

module.exports = {
  addTagToPostService,
  getPostByTagService,
  getTagByPostService,
  deleteTagFromPostService,
};
