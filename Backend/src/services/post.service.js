const mongoose = require("mongoose");
const Post = require("../models/post.model");
const User = require("../models/user.model");
const Business = require("../models/business.model");
const AppError = require("../utils/AppError");
const Asset = require("../models/asset.model");
const Post_Tag = require("../models/post_tag.model");
const { createTagService } = require("./tag.service");
const Tag = require("../models/tag.model");
const User_Like_Post = require("../models/user_like_post.model");
const Comment = require("../models/comment.model");

require("dotenv").config();

const getListPostService = async ({
  id,
  search,
  sort,
  filter,
  page = 1,
  limit = 10,
}) => {
  const isValidId = id ? mongoose.Types.ObjectId.isValid(id) : false;
  const objectId = isValidId ? new mongoose.Types.ObjectId(id) : null;

  let pipeline = [];
  let initialMatchConditions = { deleted: { $ne: true } };
  if (filter?.id) {
    initialMatchConditions.$or = [
      { user_id: new mongoose.Types.ObjectId(filter.id) },
      { business_id: new mongoose.Types.ObjectId(filter.id) },
    ];
  }
  if (search) {
    initialMatchConditions.$or = [
      ...(initialMatchConditions.$or || []),
      { title: { $regex: search, $options: "i" } },
      { content: { $regex: search, $options: "i" } },
    ];
  }
  if (Object.keys(initialMatchConditions).length > 0) {
    pipeline.push({ $match: initialMatchConditions });
  }

  pipeline.push(
    {
      $lookup: {
        from: "users",
        localField: "user_id",
        foreignField: "_id",
        as: "user",
      },
    },
    { $unwind: { path: "$user", preserveNullAndEmptyArrays: true } },
    {
      $lookup: {
        from: "businesses",
        localField: "business_id",
        foreignField: "_id",
        as: "business",
      },
    },
    { $unwind: { path: "$business", preserveNullAndEmptyArrays: true } },
    {
      $lookup: {
        from: "assets",
        localField: "_id",
        foreignField: "post_id",
        as: "media",
      },
    },
    {
      $lookup: {
        from: "post_tags",
        localField: "_id",
        foreignField: "post_id",
        as: "postTags",
      },
    },
    {
      $lookup: {
        from: "tags",
        localField: "postTags.tag_id",
        foreignField: "_id",
        as: "tags",
      },
    },
    {
      $lookup: {
        from: "user_like_posts",
        localField: "_id",
        foreignField: "post_id",
        as: "likes",
      },
    },
    {
      $lookup: {
        from: "comments",
        localField: "_id",
        foreignField: "post_id",
        as: "comments",
      },
    }
  );

  if (filter?.tags) {
    pipeline.push({ $match: { "tags.tag_name": { $in: filter.tags } } });
  }

  pipeline.push({
    $group: {
      _id: "$_id",
      user_id: { $first: "$user_id" },
      business_id: { $first: "$business_id" },
      user: { $first: "$user" },
      business: { $first: "$business" },
      title: { $first: "$title" },
      content: { $first: "$content" },
      createdAt: { $first: "$createdAt" },
      edited: { $first: "$edited" },
      updatedAt: { $first: "$updatedAt" },
      media: { $first: "$media" },
      tags: { $first: "$tags" },
      likes: { $first: "$likes" },
      comments: { $first: "$comments" },
    },
  });

  pipeline.push({
    $addFields: {
      likeCount: { $size: "$likes" },
      commentCount: { $size: "$comments" },
      isLike: {
        $cond: {
          if: {
            $and: [
              { $ne: [objectId, null] },
              {
                $or: [
                  { $in: [objectId, "$likes.user_id"] },
                  { $in: [objectId, "$likes.business_id"] },
                ],
              },
            ],
          },
          then: 1,
          else: 0,
        },
      },
      author: {
        $cond: {
          if: { $ne: ["$user_id", null] },
          then: { id: "$user_id", name: "$user.name", avatar: "$user.avatar" },
          else: {
            id: "$business_id",
            name: "$business.business_name",
            avatar: "$business.avatar",
          },
        },
      },
    },
  });

  let sortOptions = { createdAt: -1 };
  if (sort === "oldest") sortOptions = { createdAt: 1 };
  if (sort === "most_likes") sortOptions = { likeCount: -1, createdAt: -1 };
  if (sort === "most_comments")
    sortOptions = { commentCount: -1, createdAt: -1 };
  pipeline.push({ $sort: sortOptions });

  const skip = (parseInt(page) - 1) * parseInt(limit);
  pipeline.push({ $skip: skip }, { $limit: parseInt(limit) });

  pipeline.push({
    $project: {
      user_id: 1,
      business_id: 1,
      title: 1,
      content: 1,
      edited: 1,
      createdAt: 1,
      updatedAt: 1,
      media: 1,
      tags: 1,
      likeCount: 1,
      commentCount: 1,
      isLike: 1,
      author: 1,
    },
  });

  const result = await Post.aggregate(pipeline);

  let countPipeline = [{ $match: { deleted: { $ne: true } } }];
  if (Object.keys(initialMatchConditions).length > 0) {
    countPipeline.push({ $match: initialMatchConditions });
  }
  if (filter?.tags) {
    countPipeline.push(
      {
        $lookup: {
          from: "post_tags",
          localField: "_id",
          foreignField: "post_id",
          as: "postTags",
        },
      },
      {
        $lookup: {
          from: "tags",
          localField: "postTags.tag_id",
          foreignField: "_id",
          as: "tags",
        },
      },
      { $match: { "tags.tag_name": { $in: filter.tags } } }
    );
  }
  countPipeline.push({ $group: { _id: null, totalPosts: { $sum: 1 } } });
  const countResult = await Post.aggregate(countPipeline);
  const totalPosts = countResult.length > 0 ? countResult[0].totalPosts : 0;

  return {
    posts: result,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(totalPosts / limit),
      totalPosts,
    },
  };
};

const getMyPostsService = async ({
  id,
  search,
  sort,
  page = 1,
  limit = 10,
  filter = {},
}) => {
  if (!mongoose.Types.ObjectId.isValid(id))
    throw new AppError("Invalid user ID", 400);
  return await getListPostService({
    id,
    search,
    sort,
    filter: { id, ...filter },
    page,
    limit,
  });
};

const getPostByIdService = async (post_id, id) => {
  if (!mongoose.Types.ObjectId.isValid(post_id))
    throw new AppError("Invalid post ID", 400);

  const isValidId = id ? mongoose.Types.ObjectId.isValid(id) : false;
  const objectId = isValidId ? new mongoose.Types.ObjectId(id) : null;

  let result = await Post.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(post_id),
        deleted: { $ne: true },
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "user_id",
        foreignField: "_id",
        as: "user",
      },
    },
    { $unwind: { path: "$user", preserveNullAndEmptyArrays: true } },
    {
      $lookup: {
        from: "businesses",
        localField: "business_id",
        foreignField: "_id",
        as: "business",
      },
    },
    { $unwind: { path: "$business", preserveNullAndEmptyArrays: true } },
    {
      $lookup: {
        from: "assets",
        localField: "_id",
        foreignField: "post_id",
        as: "media",
      },
    },
    {
      $lookup: {
        from: "post_tags",
        localField: "_id",
        foreignField: "post_id",
        as: "postTags",
      },
    },
    {
      $lookup: {
        from: "tags",
        localField: "postTags.tag_id",
        foreignField: "_id",
        as: "tags",
      },
    },
    {
      $lookup: {
        from: "user_like_posts",
        localField: "_id",
        foreignField: "post_id",
        as: "likes",
      },
    },
    {
      $lookup: {
        from: "comments",
        localField: "_id",
        foreignField: "post_id",
        as: "comments",
      },
    },
    {
      $addFields: {
        likeCount: { $size: "$likes" },
        commentCount: { $size: "$comments" },
        isLike: isValidId
          ? {
              $cond: {
                if: {
                  $or: [
                    { $in: [objectId, "$likes.user_id"] },
                    { $in: [objectId, "$likes.business_id"] },
                  ],
                },
                then: 1,
                else: 0,
              },
            }
          : 0,
        author: {
          $cond: {
            if: { $ne: ["$user_id", null] },
            then: {
              id: "$user_id",
              name: "$user.name",
              avatar: "$user.avatar",
            },
            else: {
              id: "$business_id",
              name: "$business.business_name",
              avatar: "$business.avatar",
            },
          },
        },
      },
    },
    {
      $project: {
        user_id: 1,
        business_id: 1,
        title: 1,
        content: 1,
        edited: 1,
        createdAt: 1,
        updatedAt: 1,
        media: 1,
        tags: 1,
        likeCount: 1,
        commentCount: 1,
        isLike: 1,
        author: 1,
      },
    },
  ]);

  if (!result || result.length === 0) throw new AppError("Post not found", 404);
  return result[0];
};

const getLikedPostsService = async ({
  id,
  search,
  sort,
  page = 1,
  limit = 10,
  filter = {},
}) => {
  if (!mongoose.Types.ObjectId.isValid(id))
    throw new AppError("Invalid user ID", 400);

  const objectId = new mongoose.Types.ObjectId(id);

  let pipeline = [
    // Match các lượt thích của user hoặc business
    {
      $match: {
        $or: [{ user_id: objectId }, { business_id: objectId }],
      },
    },
    // Join với bảng posts
    {
      $lookup: {
        from: "posts",
        localField: "post_id",
        foreignField: "_id",
        as: "post",
      },
    },
    { $unwind: "$post" },
    // Lọc bài viết chưa bị xóa mềm
    { $match: { "post.deleted": { $ne: true } } },
  ];

  // Thêm điều kiện tìm kiếm nếu có
  if (search) {
    pipeline.push({
      $match: {
        $or: [
          { "post.title": { $regex: search, $options: "i" } },
          { "post.content": { $regex: search, $options: "i" } },
        ],
      },
    });
  }

  // Thêm các lookup và aggregation
  pipeline.push(
    {
      $lookup: {
        from: "users",
        localField: "post.user_id",
        foreignField: "_id",
        as: "post.user",
      },
    },
    { $unwind: { path: "$post.user", preserveNullAndEmptyArrays: true } },
    {
      $lookup: {
        from: "businesses",
        localField: "post.business_id",
        foreignField: "_id",
        as: "post.business",
      },
    },
    { $unwind: { path: "$post.business", preserveNullAndEmptyArrays: true } },
    {
      $lookup: {
        from: "assets",
        localField: "post._id",
        foreignField: "post_id",
        as: "post.media",
      },
    },
    {
      $lookup: {
        from: "post_tags",
        localField: "post._id",
        foreignField: "post_id",
        as: "post.postTags",
      },
    },
    {
      $lookup: {
        from: "tags",
        localField: "post.postTags.tag_id",
        foreignField: "_id",
        as: "post.tags",
      },
    },
    {
      $lookup: {
        from: "user_like_posts", // Tên collection thực tế trong DB
        localField: "post._id",
        foreignField: "post_id",
        as: "post.likes",
      },
    },
    {
      $lookup: {
        from: "comments",
        localField: "post._id",
        foreignField: "post_id",
        as: "post.comments",
      },
    },
    // Lọc bình luận chưa bị xóa mềm
    {
      $match: {
        "post.comments.deleted": { $ne: true },
      },
    }
  );

  // Thêm các trường tính toán
  pipeline.push({
    $addFields: {
      "post.likeCount": { $size: "$post.likes" },
      "post.commentCount": { $size: "$post.comments" },
      "post.isLike": 1, // Vì đây là danh sách bài đã thích
      "post.author": {
        $cond: {
          if: { $ne: ["$post.user_id", null] },
          then: {
            id: "$post.user_id",
            name: "$post.user.name",
            avatar: "$post.user.avatar",
          },
          else: {
            id: "$post.business_id",
            name: "$post.business.business_name",
            avatar: "$post.business.avatar",
          },
        },
      },
    },
  });

  // Sắp xếp
  let sortOptions = { "post.createdAt": -1 };
  if (sort === "oldest") sortOptions = { "post.createdAt": 1 };
  if (sort === "most_likes") sortOptions = { "post.likeCount": -1 };
  if (sort === "most_comments") sortOptions = { "post.commentCount": -1 };
  pipeline.push({ $sort: sortOptions });

  // Phân trang
  const skip = (parseInt(page) - 1) * parseInt(limit);
  pipeline.push({ $skip: skip }, { $limit: parseInt(limit) });

  // Dự án các trường cần thiết
  pipeline.push({
    $project: {
      "post._id": 1,
      "post.user_id": 1,
      "post.business_id": 1,
      "post.title": 1,
      "post.content": 1,
      "post.edited": 1,
      "post.createdAt": 1,
      "post.updatedAt": 1,
      "post.media": 1,
      "post.tags": 1,
      "post.likeCount": 1,
      "post.commentCount": 1,
      "post.isLike": 1,
      "post.author": 1,
    },
  });

  const result = await User_Like_Post.aggregate(pipeline);

  // Tổng số bài viết đã thích
  const countPipeline = [
    {
      $match: {
        $or: [{ user_id: objectId }, { business_id: objectId }],
      },
    },
    {
      $lookup: {
        from: "posts",
        localField: "post_id",
        foreignField: "_id",
        as: "post",
      },
    },
    { $unwind: "$post" },
    { $match: { "post.deleted": { $ne: true } } },
    { $group: { _id: null, totalPosts: { $sum: 1 } } },
  ];
  const countResult = await User_Like_Post.aggregate(countPipeline);
  const totalPosts = countResult.length > 0 ? countResult[0].totalPosts : 0;

  return {
    posts: result.map((item) => item.post),
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(totalPosts / limit),
      totalPosts,
    },
  };
};

const getCommentedPostsService = async ({
  id,
  search,
  sort,
  page = 1,
  limit = 10,
  filter = {},
}) => {
  if (!mongoose.Types.ObjectId.isValid(id))
    throw new AppError("Invalid user ID", 400);

  const objectId = new mongoose.Types.ObjectId(id);

  let pipeline = [
    // Match các bình luận của user hoặc business
    {
      $match: {
        $or: [{ user_id: objectId }, { business_id: objectId }],
        deleted: { $ne: true }, // Lọc bình luận chưa bị xóa mềm
      },
    },
    // Nhóm theo post_id để loại bỏ trùng lặp
    {
      $group: {
        _id: "$post_id", // Nhóm theo post_id
      },
    },
    // Join với bảng posts
    {
      $lookup: {
        from: "posts",
        localField: "_id",
        foreignField: "_id",
        as: "post",
      },
    },
    { $unwind: "$post" },
    // Lọc bài viết chưa bị xóa mềm
    { $match: { "post.deleted": { $ne: true } } },
  ];

  // Thêm điều kiện tìm kiếm nếu có
  if (search) {
    pipeline.push({
      $match: {
        $or: [
          { "post.title": { $regex: search, $options: "i" } },
          { "post.content": { $regex: search, $options: "i" } },
        ],
      },
    });
  }

  // Thêm các lookup và aggregation
  pipeline.push(
    {
      $lookup: {
        from: "users",
        localField: "post.user_id",
        foreignField: "_id",
        as: "post.user",
      },
    },
    { $unwind: { path: "$post.user", preserveNullAndEmptyArrays: true } },
    {
      $lookup: {
        from: "businesses",
        localField: "post.business_id",
        foreignField: "_id",
        as: "post.business",
      },
    },
    { $unwind: { path: "$post.business", preserveNullAndEmptyArrays: true } },
    {
      $lookup: {
        from: "assets",
        localField: "post._id",
        foreignField: "post_id",
        as: "post.media",
      },
    },
    {
      $lookup: {
        from: "post_tags",
        localField: "post._id",
        foreignField: "post_id",
        as: "post.postTags",
      },
    },
    {
      $lookup: {
        from: "tags",
        localField: "post.postTags.tag_id",
        foreignField: "_id",
        as: "post.tags",
      },
    },
    {
      $lookup: {
        from: "user_like_posts",
        localField: "post._id",
        foreignField: "post_id",
        as: "post.likes",
      },
    },
    {
      $lookup: {
        from: "comments",
        localField: "post._id",
        foreignField: "post_id",
        as: "post.comments",
      },
    },
    // Lọc bình luận chưa bị xóa mềm
    {
      $match: {
        "post.comments.deleted": { $ne: true },
      },
    }
  );

  // Thêm các trường tính toán
  pipeline.push({
    $addFields: {
      "post.likeCount": { $size: "$post.likes" },
      "post.commentCount": { $size: "$post.comments" },
      "post.isLike": {
        $cond: {
          if: {
            $or: [
              { $in: [objectId, "$post.likes.user_id"] },
              { $in: [objectId, "$post.likes.business_id"] },
            ],
          },
          then: 1,
          else: 0,
        },
      },
      "post.author": {
        $cond: {
          if: { $ne: ["$post.user_id", null] },
          then: {
            id: "$post.user_id",
            name: "$post.user.name",
            avatar: "$post.user.avatar",
          },
          else: {
            id: "$post.business_id",
            name: "$post.business.business_name",
            avatar: "$post.business.avatar",
          },
        },
      },
    },
  });

  // Sắp xếp
  let sortOptions = { "post.createdAt": -1 };
  if (sort === "oldest") sortOptions = { "post.createdAt": 1 };
  if (sort === "most_likes") sortOptions = { "post.likeCount": -1 };
  if (sort === "most_comments") sortOptions = { "post.commentCount": -1 };
  pipeline.push({ $sort: sortOptions });

  // Phân trang
  const skip = (parseInt(page) - 1) * parseInt(limit);
  pipeline.push({ $skip: skip }, { $limit: parseInt(limit) });

  // Dự án các trường cần thiết
  pipeline.push({
    $project: {
      "post._id": 1,
      "post.user_id": 1,
      "post.business_id": 1,
      "post.title": 1,
      "post.content": 1,
      "post.edited": 1,
      "post.createdAt": 1,
      "post.updatedAt": 1,
      "post.media": 1,
      "post.tags": 1,
      "post.likeCount": 1,
      "post.commentCount": 1,
      "post.isLike": 1,
      "post.author": 1,
    },
  });

  const result = await Comment.aggregate(pipeline);

  // Tổng số bài viết đã bình luận
  const countPipeline = [
    {
      $match: {
        $or: [{ user_id: objectId }, { business_id: objectId }],
        deleted: { $ne: true }, // Lọc bình luận chưa bị xóa mềm
      },
    },
    // Nhóm theo post_id để đếm số bài viết duy nhất
    {
      $group: {
        _id: "$post_id",
      },
    },
    {
      $lookup: {
        from: "posts",
        localField: "_id",
        foreignField: "_id",
        as: "post",
      },
    },
    { $unwind: "$post" },
    { $match: { "post.deleted": { $ne: true } } },
    { $group: { _id: null, totalPosts: { $sum: 1 } } },
  ];
  const countResult = await Comment.aggregate(countPipeline);
  const totalPosts = countResult.length > 0 ? countResult[0].totalPosts : 0;

  return {
    posts: result.map((item) => item.post),
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(totalPosts / limit),
      totalPosts,
    },
  };
};

const createPostService = async (id, title, content, tags, files) => {
  if (!title || !content) throw new AppError("Missing required fields", 400);
  if (!id || !mongoose.Types.ObjectId.isValid(id))
    throw new AppError("A valid ID must be provided", 400);

  const objectId = new mongoose.Types.ObjectId(id);
  const user = await User.findById(objectId);
  const business = await Business.findById(objectId);
  if (!user && !business)
    throw new AppError("ID does not belong to any user or business", 404);

  let result = await Post.create({
    user_id: user ? objectId : null,
    business_id: business ? objectId : null,
    title,
    content,
    edited: false,
  });

  if (files && files.length > 0) {
    const mediaDocs = files.map((file) => {
      let type = file.mimetype.startsWith("image/")
        ? "image"
        : file.mimetype.startsWith("video/")
        ? "video"
        : null;
      if (!type) throw new AppError("Unsupported file type", 400);
      return { post_id: result._id, type, url: file.path };
    });
    await Asset.insertMany(mediaDocs);
  }

  if (tags && tags.length > 0) {
    for (const tag_name of tags) {
      let tag =
        (await Tag.findOne({ tag_name })) || (await createTagService(tag_name));
      if (!(await Post_Tag.findOne({ post_id: result._id, tag_id: tag._id }))) {
        await Post_Tag.create({ post_id: result._id, tag_id: tag._id });
      }
    }
  }

  return await getPostByIdService(result._id.toString(), id);
};

const updatePostService = async (post_id, id, updateData) => {
  if (!mongoose.Types.ObjectId.isValid(post_id))
    throw new AppError("Invalid post ID", 400);
  if (!mongoose.Types.ObjectId.isValid(id))
    throw new AppError("Invalid user or business ID", 400);

  const objectId = new mongoose.Types.ObjectId(id);
  const post = await Post.findOne({
    _id: post_id,
    $or: [{ user_id: objectId }, { business_id: objectId }],
  });
  if (!post)
    throw new AppError(
      "Post not found or you don't have permission to update",
      404
    );

  const { title, content, tags, deletedMediaIds, files } = updateData;

  // Cập nhật title, content và đánh dấu edited nếu có thay đổi
  const updateFields = {};
  if (title) updateFields.title = title;
  if (content) updateFields.content = content;

  // Kiểm tra xem có thay đổi nào không để đánh dấu edited
  const hasChanges =
    Object.keys(updateFields).length > 0 || // Thay đổi title hoặc content
    (tags !== undefined && (tags.length > 0 || post.tags?.length > 0)) || // Thay đổi tags
    (deletedMediaIds && deletedMediaIds.length > 0) || // Xóa media
    (files && files.length > 0); // Thêm media

  if (hasChanges) {
    updateFields.edited = true; // Đánh dấu đã chỉnh sửa
    const updatedPost = await Post.findOneAndUpdate(
      { _id: post_id },
      { $set: updateFields },
      { new: true, runValidators: true } // runValidators để kiểm tra required
    );
    if (!updatedPost) throw new AppError("Failed to update post", 500);
  }

  // Xóa media cũ nếu có deletedMediaIds
  if (deletedMediaIds && deletedMediaIds.length > 0) {
    await Asset.deleteMany({
      post_id: post_id,
      _id: {
        $in: deletedMediaIds.map((id) => new mongoose.Types.ObjectId(id)),
      },
    });
  }

  // Thêm media mới nếu có files
  if (files && files.length > 0) {
    const mediaDocs = files.map((file) => {
      let type = file.mimetype.startsWith("image/")
        ? "image"
        : file.mimetype.startsWith("video/")
        ? "video"
        : null;
      if (!type) throw new AppError("Unsupported file type", 400);
      return { post_id: post_id, type, url: file.path };
    });
    await Asset.insertMany(mediaDocs);
  }

  // Cập nhật tags nếu được cung cấp
  if (tags !== undefined) {
    await Post_Tag.deleteMany({ post_id: post_id });
    if (tags.length > 0) {
      for (const tag_name of tags) {
        let tag =
          (await Tag.findOne({ tag_name })) ||
          (await createTagService(tag_name));
        if (!(await Post_Tag.findOne({ post_id: post_id, tag_id: tag._id }))) {
          await Post_Tag.create({ post_id: post_id, tag_id: tag._id });
        }
      }
    }
  }

  return await getPostByIdService(post_id, id);
};

const deletePostService = async (post_id, id) => {
  if (!mongoose.Types.ObjectId.isValid(post_id))
    throw new AppError("Invalid post ID", 400);
  if (!mongoose.Types.ObjectId.isValid(id))
    throw new AppError("Invalid user or business ID", 400);

  const objectId = new mongoose.Types.ObjectId(id);
  const post = await Post.findOne({
    _id: post_id,
    $or: [{ user_id: objectId }, { business_id: objectId }],
  });
  if (!post)
    throw new AppError(
      "Post not found or you don't have permission to delete",
      404
    );

  await Asset.deleteMany({ post_id: post_id });
  await Post_Tag.deleteMany({ post_id: post_id });
  await post.delete();

  return { message: "Post deleted successfully", postId: post_id };
};

module.exports = {
  getListPostService,
  getPostByIdService,
  createPostService,
  updatePostService,
  deletePostService,
  getMyPostsService,
  getLikedPostsService,
  getCommentedPostsService,
};
