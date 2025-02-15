const mongoose = require("mongoose");
const Post = require("../models/post.model");
const AppError = require("../utils/AppError");
const Asset = require("../models/asset.model");
const Post_Tag = require("../models/post_tag.model");
const { getTagByPostService } = require("./post_tag.service");
const User_Like_Post = require("../models/user_like_post.model");

require("dotenv").config();

const getListPostService = async (user_id) => {
  // Lấy danh sách tất cả bài viết, kèm userId (username, email)
  let result = await Post.find().populate("user_id", "name email");

  // Lấy danh sách tất cả post_id để truy vấn ảnh và tags nhanh hơn
  const postIds = result.map((post) => post._id);

  // Lấy tất cả ảnh theo danh sách post_id
  const images = await Asset.find({ post_id: { $in: postIds } });

  // Lấy tất cả tags theo danh sách post_id
  const tagsMap = {};
  for (const postId of postIds) {
    tagsMap[postId] = await getTagByPostService(postId);
  }
  //kiểm tra user đang đăng nhập có like bài post này không

  const likedPosts = await User_Like_Post.find({
    user_id,
    post_id: { $in: postIds },
  }).select("post_id");

  const likedPostIds = new Set(
    likedPosts.map((like) => like.post_id.toString())
  );

  // Gán images và tags vào từng post
  return result.map((post) => ({
    ...post._doc,
    images: images.filter((image) => image.post_id.equals(post._id)),
    tags: tagsMap[post._id] || [],
    isLike: likedPostIds.has(post._id.toString()) ? 1 : 0,
  }));
};

const getPostByIdService = async (post_id, user_id) => {
  if (!mongoose.Types.ObjectId.isValid(post_id)) {
    throw new AppError("Invalid post ID", 400);
  }

  let result = await Post.findById(post_id);

  const images = await Asset.find({ post_id });

  const tags = await getTagByPostService(post_id);
  const isLiked = await User_Like_Post.findOne({ user_id, post_id });
  if (!result) {
    throw new AppError("Post not found", 404);
  }

  return { ...result._doc, images, tags, isLike: isLiked ? 1 : 0 };
};

const createPostService = async (user_id, title, content, files) => {
  if (!user_id || !title || !content) {
    throw new AppError("Missing required fields", 400);
  }

  let result = await Post.create({
    user_id: user_id,
    title: title,
    content: content,
  });

  if (files && files.length > 0) {
    const imageDocs = files.map((file) => ({
      post_id: result._id,
      type: "image",
      url: file.path,
    }));
    await Asset.insertMany(imageDocs);
  }

  return result;
};

const updatePostService = async (id, dataUpdate) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError("Invalid post ID", 400);
  }

  let result = await Post.findOneAndUpdate(
    { _id: id, deleted: { $ne: true } }, // Chỉ cập nhật bài chưa bị xóa
    dataUpdate,
    { new: true }
  );

  if (!result) {
    throw new AppError("Post not found", 404);
  }

  return result;
};

const deletePostService = async (id) => {
  let post = await Post.findById(id);
  await Asset.deleteMany({ post_id: id });
  await Post_Tag.deleteMany({ post_id: id });
  if (!post) {
    throw new AppError("Post not found", 404);
  }
  let result = post.delete();
  return result;
};

module.exports = {
  getListPostService,
  getPostByIdService,
  createPostService,
  updatePostService,
  deletePostService,
};
