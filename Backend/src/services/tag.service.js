const mongoose = require("mongoose");
const AppError = require("../utils/AppError");
const Tag = require("../models/tag.model");

require("dotenv").config();

const getListTagService = async () => {
  let result = await Tag.find();
  return result;
};

const createTagService = async (tag_name) => {
  if (!tag_name) {
    throw new AppError("Missing required fields", 400);
  }

  let result = await Tag.create({
    tag_name: tag_name,
  });

  return result;
};

const deleteTagService = async (tag_id) => {
  let tag = await Tag.findById(tag_id);
  if (!tag) {
    throw new AppError("Tag not found", 404);
  }
  let result = tag.delete();
  return result;
};

module.exports = {
  getListTagService,
  createTagService,
  deleteTagService,
};
