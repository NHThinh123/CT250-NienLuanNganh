const mongoose = require("mongoose");
const AppError = require("../utils/AppError");
const Comment = require("../models/comment.model");
require("dotenv").config();

const createCommentService = async (
  user_id,
  post_id,
  parent_comment_id,
  comment_content
) => {
  if (!user_id || !post_id || !comment_content) {
    throw new AppError("Missing required fields", 400);
  }
  let result = await Comment.create({
    user_id: user_id,
    post_id: post_id,
    parent_comment_id: parent_comment_id,
    comment_content: comment_content,
  });
  return result;
};

const getListCommentByPostService = async (query) => {
  const { post_id, user_id } = query;
  if (!mongoose.Types.ObjectId.isValid(post_id)) {
    throw new AppError("Invalid post ID", 400);
  }
  let comments = await Comment.aggregate([
    { $match: { post_id: new mongoose.Types.ObjectId(post_id) } },
    {
      $lookup: {
        from: "users",
        localField: "user_id",
        foreignField: "_id",
        as: "user_id",
      },
    },
    { $unwind: "$user_id" },
    {
      $lookup: {
        from: "user_like_comments",
        localField: "_id",
        foreignField: "comment_id",
        as: "likes",
      },
    },
    {
      $addFields: {
        likeCount: { $size: "$likes" },
        isLike: {
          $in: [new mongoose.Types.ObjectId(user_id), "$likes.user_id"],
        },
      },
    },
    { $sort: { createdAt: -1 } },
    {
      $project: {
        user_id: {
          _id: 1,
          name: 1,
          avatar: 1,
        },
        comment_content: 1,
        createdAt: 1,
        likeCount: 1,
        isLike: 1,
        parent_comment_id: 1,
      },
    },
  ]);

  let parentComments = comments.filter((c) => !c.parent_comment_id);
  let result = parentComments.map((comment) => ({
    ...comment,
    replyCount: comments.filter(
      (c) => String(c.parent_comment_id) === String(comment._id)
    ).length,
  }));

  return result;
};

const getCommentByIdService = async (comment_id) => {
  if (!mongoose.Types.ObjectId.isValid(comment_id)) {
    throw new AppError("Invalid comment ID", 400);
  }

  let result = await Comment.findById(comment_id).populate(
    "user_id",
    "name _id"
  );

  if (!result) {
    throw new AppError("Comment not found", 404);
  }
  let replies = await Comment.find({ parent_comment_id: comment_id }).populate(
    "user_id",
    "name _id"
  );
  return { ...result._doc, replies };
};

const getReplyByCommentService = async (query) => {
  const { comment_id, user_id } = query;
  if (!mongoose.Types.ObjectId.isValid(comment_id)) {
    throw new AppError("Invalid comment ID", 400);
  }

  let replies = await Comment.aggregate([
    { $match: { parent_comment_id: new mongoose.Types.ObjectId(comment_id) } },
    {
      $lookup: {
        from: "users",
        localField: "user_id",
        foreignField: "_id",
        as: "user_id",
      },
    },
    { $unwind: "$user_id" },
    {
      $lookup: {
        from: "user_like_comments",
        localField: "_id",
        foreignField: "comment_id",
        as: "likes",
      },
    },
    {
      $addFields: {
        likeCount: { $size: "$likes" },
        isLike: {
          $in: [new mongoose.Types.ObjectId(user_id), "$likes.user_id"],
        },
      },
    },
    {
      $project: {
        user_id: {
          _id: 1,
          name: 1,
          avatar: 1,
        },
        comment_content: 1,
        createdAt: 1,
        likeCount: 1,
        isLike: 1,
        parent_comment_id: 1,
      },
    },
  ]);

  // Đếm số lượng reply con cho từng reply
  for (let reply of replies) {
    let replyCount = await Comment.countDocuments({
      parent_comment_id: reply._id,
    });
    reply.replyCount = replyCount;
  }

  return replies;
};

const updateCommentService = async (comment_id, dataUpdate) => {
  if (!mongoose.Types.ObjectId.isValid(comment_id)) {
    throw new AppError("Invalid comment ID", 400);
  }

  let result = await Comment.findOneAndUpdate({ _id: comment_id }, dataUpdate, {
    new: true,
  });

  if (!result) {
    throw new AppError("Comment not found", 404);
  }

  return result;
};

const deleteCommentService = async (comment_id) => {
  let comment = await Comment.findById(comment_id);
  if (!comment) {
    throw new AppError("Comment not found", 404);
  }
  let result = comment.delete();
  return result;
};

module.exports = {
  createCommentService,
  getListCommentByPostService,
  getCommentByIdService,
  getReplyByCommentService,
  updateCommentService,
  deleteCommentService,
};
