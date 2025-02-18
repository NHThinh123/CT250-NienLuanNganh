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
  let result = await Post.aggregate([
    {
      //tìm kiếm thông tin user tác giả
      $lookup: {
        from: "users",
        localField: "user_id",
        foreignField: "_id",
        as: "user",
      },
    },
    //chuyển user từ mảng object về object
    { $unwind: "$user" },
    {
      // tìm kiếm ảnh của bài viết
      $lookup: {
        from: "assets",
        localField: "_id",
        foreignField: "post_id",
        as: "images",
      },
    },
    {
      // tìm kiếm tag của bài viết
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
      // tìm danh sách id người like bài viết
      $lookup: {
        from: "user_like_posts",
        localField: "_id",
        foreignField: "post_id",
        as: "likes",
      },
    },
    {
      //tính số lượt like và user đang đăng nhập có like bài viết không
      $addFields: {
        likeCount: { $size: "$likes" },
        isLike: {
          $cond: {
            if: {
              $in: [new mongoose.Types.ObjectId(user_id), "$likes.user_id"],
            },
            then: 1,
            else: 0,
          },
        },
      },
    },
    {
      // chọn ra những trường cần thiết
      $project: {
        user_id: 1,
        "user.name": 1,
        "user.email": 1,
        title: 1, // Tiêu đề bài viết
        content: 1, // Nội dung bài viết
        createdAt: 1, // Ngày tạo
        updatedAt: 1, // Ngày cập nhật
        images: 1,
        tags: 1,
        likeCount: 1,
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
