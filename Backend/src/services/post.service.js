const mongoose = require("mongoose");
const Post = require("../models/post.model");
const AppError = require("../utils/AppError");
const Asset = require("../models/asset.model");
const Post_Tag = require("../models/post_tag.model");
const { getTagByPostService } = require("./post_tag.service");
const User_Like_Post = require("../models/user_like_post.model");
const { createTagService } = require("./tag.service");
const Tag = require("../models/tag.model");

require("dotenv").config();

const getListPostService = async (user_id) => {
  // Kiểm tra user_id có hợp lệ không
  const isValidUserId = mongoose.Types.ObjectId.isValid(user_id);
  const userObjectId = isValidUserId
    ? new mongoose.Types.ObjectId(user_id)
    : null;

  let result = await Post.aggregate([
    {
      // Tìm kiếm thông tin user tác giả
      $lookup: {
        from: "users",
        localField: "user_id",
        foreignField: "_id",
        as: "user",
      },
    },
    { $unwind: "$user" },
    {
      // Tìm kiếm ảnh của bài viết
      $lookup: {
        from: "assets",
        localField: "_id",
        foreignField: "post_id",
        as: "images",
      },
    },
    {
      // Tìm kiếm tag của bài viết
      $lookup: {
        from: "post_tags",
        localField: "_id",
        foreignField: "post_id",
        as: "postTags",
      },
    },
    {
      $lookup: {
        from: "tags", // Bảng chứa tên tags
        localField: "postTags.tag_id",
        foreignField: "_id",
        as: "tags",
      },
    },
    {
      // Tìm danh sách id người like bài viết
      $lookup: {
        from: "user_like_posts",
        localField: "_id",
        foreignField: "post_id",
        as: "likes",
      },
    },
    {
      // Tìm danh sách comment của bài viết
      $lookup: {
        from: "comments",
        localField: "_id",
        foreignField: "post_id",
        as: "comments",
      },
    },
    {
      // Tính số lượt like và kiểm tra user có like bài viết không
      $addFields: {
        likeCount: { $size: "$likes" },
        commentCount: { $size: "$comments" },
        isLike: isValidUserId
          ? {
              $cond: {
                if: { $in: [userObjectId, "$likes.user_id"] },
                then: 1,
                else: 0,
              },
            }
          : 0, // Nếu user_id không hợp lệ thì isLike = 0
      },
    },
    {
      // Chọn ra những trường cần thiết
      $project: {
        user_id: 1,
        "user.name": 1,
        "user.email": 1,
        "user.avatar": 1,
        title: 1,
        content: 1,
        createdAt: 1,
        updatedAt: 1,
        images: 1,
        tags: 1,
        likeCount: 1,
        commentCount: 1,
        isLike: 1,
      },
    },
  ]);

  return result;
};

const getPostByIdService = async (post_id, user_id) => {
  if (!mongoose.Types.ObjectId.isValid(post_id)) {
    throw new AppError("Invalid post ID", 400);
  }

  let result = await Post.findById(post_id);

  const images = await Asset.find({ post_id });

  const tags = await getTagByPostService(post_id);
  const isLiked = await User_Like_Post.findOne({ user_id, post_id });
  const likeCount = await User_Like_Post.find({ post_id }).countDocuments();
  if (!result) {
    throw new AppError("Post not found", 404);
  }

  return { ...result._doc, images, tags, isLike: isLiked ? 1 : 0, likeCount };
};

const createPostService = async (user_id, title, content, tags, files) => {
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

  // Xử lý tags
  if (tags && tags.length > 0) {
    for (const tag_name of tags) {
      let tag = await Tag.findOne({ tag_name });

      // Nếu tag chưa tồn tại, tạo mới
      if (!tag) {
        tag = await createTagService(tag_name);
      }

      // Kiểm tra mối quan hệ post - tag đã tồn tại chưa
      const existingPostTag = await Post_Tag.findOne({
        post_id: result._id,
        tag_id: tag._id,
      });

      // Nếu chưa có, thêm vào bảng Post_Tag
      if (!existingPostTag) {
        await Post_Tag.create({
          post_id: result._id,
          tag_id: tag._id,
        });
      }
    }
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
