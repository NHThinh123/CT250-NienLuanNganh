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
      { linked_business_id: new mongoose.Types.ObjectId(filter.id) }, // Thêm điều kiện lọc theo linked_business_id
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
        from: "businesses",
        localField: "linked_business_id", // Lookup cho linked_business_id
        foreignField: "_id",
        as: "linked_business",
      },
    },
    { $unwind: { path: "$linked_business", preserveNullAndEmptyArrays: true } },
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
      linked_business_id: { $first: "$linked_business_id" }, // Thêm linked_business_id
      user: { $first: "$user" },
      business: { $first: "$business" },
      linked_business: { $first: "$linked_business" }, // Thêm thông tin quán liên quan
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
      linked_business_id: 1, // Thêm vào kết quả trả về
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
      linked_business: 1, // Thêm thông tin quán liên quan vào kết quả
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
        from: "businesses",
        localField: "linked_business_id", // Lookup cho linked_business_id
        foreignField: "_id",
        as: "linked_business",
      },
    },
    { $unwind: { path: "$linked_business", preserveNullAndEmptyArrays: true } },
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
        linked_business_id: 1, // Thêm vào kết quả trả về
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
        linked_business: 1, // Thêm thông tin quán liên quan
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
  ];

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
        from: "businesses",
        localField: "post.linked_business_id", // Lookup cho linked_business_id
        foreignField: "_id",
        as: "post.linked_business",
      },
    },
    {
      $unwind: {
        path: "$post.linked_business",
        preserveNullAndEmptyArrays: true,
      },
    },
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
    {
      $match: {
        "post.comments.deleted": { $ne: true },
      },
    }
  );

  pipeline.push({
    $addFields: {
      "post.likeCount": { $size: "$post.likes" },
      "post.commentCount": { $size: "$post.comments" },
      "post.isLike": 1,
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

  let sortOptions = { "post.createdAt": -1 };
  if (sort === "oldest") sortOptions = { "post.createdAt": 1 };
  if (sort === "most_likes") sortOptions = { "post.likeCount": -1 };
  if (sort === "most_comments") sortOptions = { "post.commentCount": -1 };
  pipeline.push({ $sort: sortOptions });

  const skip = (parseInt(page) - 1) * parseInt(limit);
  pipeline.push({ $skip: skip }, { $limit: parseInt(limit) });

  pipeline.push({
    $project: {
      "post._id": 1,
      "post.user_id": 1,
      "post.business_id": 1,
      "post.linked_business_id": 1, // Thêm vào kết quả trả về
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
      "post.linked_business": 1, // Thêm thông tin quán liên quan
    },
  });

  const result = await User_Like_Post.aggregate(pipeline);

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
    {
      $match: {
        $or: [{ user_id: objectId }, { business_id: objectId }],
        deleted: { $ne: true },
      },
    },
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
  ];

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
        from: "businesses",
        localField: "post.linked_business_id", // Lookup cho linked_business_id
        foreignField: "_id",
        as: "post.linked_business",
      },
    },
    {
      $unwind: {
        path: "$post.linked_business",
        preserveNullAndEmptyArrays: true,
      },
    },
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
    {
      $match: {
        "post.comments.deleted": { $ne: true },
      },
    }
  );

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

  let sortOptions = { "post.createdAt": -1 };
  if (sort === "oldest") sortOptions = { "post.createdAt": 1 };
  if (sort === "most_likes") sortOptions = { "post.likeCount": -1 };
  if (sort === "most_comments") sortOptions = { "post.commentCount": -1 };
  pipeline.push({ $sort: sortOptions });

  const skip = (parseInt(page) - 1) * parseInt(limit);
  pipeline.push({ $skip: skip }, { $limit: parseInt(limit) });

  pipeline.push({
    $project: {
      "post._id": 1,
      "post.user_id": 1,
      "post.business_id": 1,
      "post.linked_business_id": 1, // Thêm vào kết quả trả về
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
      "post.linked_business": 1, // Thêm thông tin quán liên quan
    },
  });

  const result = await Comment.aggregate(pipeline);

  const countPipeline = [
    {
      $match: {
        $or: [{ user_id: objectId }, { business_id: objectId }],
        deleted: { $ne: true },
      },
    },
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

const createPostService = async (
  id,
  title,
  content,
  tags,
  files,
  related_business_id
) => {
  if (!title || !content) throw new AppError("Missing required fields", 400);
  if (!id || !mongoose.Types.ObjectId.isValid(id))
    throw new AppError("A valid ID must be provided", 400);
  if (
    related_business_id &&
    !mongoose.Types.ObjectId.isValid(related_business_id)
  )
    throw new AppError("Invalid related business ID", 400);

  const objectId = new mongoose.Types.ObjectId(id);
  const user = await User.findById(objectId);
  const business = await Business.findById(objectId);
  if (!user && !business)
    throw new AppError("ID does not belong to any user or business", 404);

  // Kiểm tra xem related_business_id có tồn tại trong Business không
  if (related_business_id) {
    const linkedBusiness = await Business.findById(related_business_id);
    if (!linkedBusiness) throw new AppError("Related business not found", 404);
  }

  let result = await Post.create({
    user_id: user ? objectId : null,
    business_id: business ? objectId : null,
    linked_business_id: related_business_id
      ? new mongoose.Types.ObjectId(related_business_id)
      : null, // Thêm linked_business_id
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

  // Kiểm tra vai trò của người dùng
  const user = await User.findById(objectId);
  const isAdmin = user && user.role === "admin";

  // Tìm bài viết
  let post;
  if (isAdmin) {
    // Admin có thể sửa bất kỳ bài viết nào
    post = await Post.findById(post_id);
  } else {
    // Người dùng thường chỉ sửa bài viết của họ
    post = await Post.findOne({
      _id: post_id,
      $or: [{ user_id: objectId }, { business_id: objectId }],
    });
  }

  if (!post)
    throw new AppError(
      "Post not found or you don't have permission to update",
      404
    );

  const { title, content, tags, deletedMediaIds, files, related_business_id } =
    updateData;

  // Kiểm tra related_business_id nếu được cung cấp
  if (
    related_business_id &&
    !mongoose.Types.ObjectId.isValid(related_business_id)
  )
    throw new AppError("Invalid related business ID", 400);
  if (related_business_id) {
    const linkedBusiness = await Business.findById(related_business_id);
    if (!linkedBusiness) throw new AppError("Related business not found", 404);
  }

  // Cập nhật các trường
  const updateFields = {};
  if (title) updateFields.title = title;
  if (content) updateFields.content = content;
  if (related_business_id !== undefined)
    updateFields.linked_business_id = related_business_id
      ? new mongoose.Types.ObjectId(related_business_id)
      : null;

  const hasChanges =
    Object.keys(updateFields).length > 0 ||
    (tags !== undefined && (tags.length > 0 || post.tags?.length > 0)) ||
    (deletedMediaIds && deletedMediaIds.length > 0) ||
    (files && files.length > 0);

  if (hasChanges) {
    updateFields.edited = true;
    const updatedPost = await Post.findOneAndUpdate(
      { _id: post_id },
      { $set: updateFields },
      { new: true, runValidators: true }
    );
    if (!updatedPost) throw new AppError("Failed to update post", 500);
  }

  if (deletedMediaIds && deletedMediaIds.length > 0) {
    await Asset.deleteMany({
      post_id: post_id,
      _id: {
        $in: deletedMediaIds.map((id) => new mongoose.Types.ObjectId(id)),
      },
    });
  }

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

  // Kiểm tra vai trò của người dùng
  const user = await User.findById(objectId);
  const isAdmin = user && user.role === "admin";

  // Tìm bài viết
  let post;
  if (isAdmin) {
    // Admin có thể xóa bất kỳ bài viết nào
    post = await Post.findById(post_id);
  } else {
    // Người dùng thường chỉ xóa bài viết của họ
    post = await Post.findOne({
      _id: post_id,
      $or: [{ user_id: objectId }, { business_id: objectId }],
    });
  }

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

const getPostFrequencyService = async (id, timeRange = "7days") => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError("Invalid user or business ID", 400);
  }

  const objectId = new mongoose.Types.ObjectId(id);
  let startDate;

  // Xác định khoảng thời gian dựa trên timeRange
  const now = new Date();
  switch (timeRange.toLowerCase()) {
    case "7days":
      startDate = new Date(now.setDate(now.getDate() - 7)); // 7 ngày qua
      break;
    case "28days":
      startDate = new Date(now.setDate(now.getDate() - 28)); // 28 ngày qua
      break;
    case "all":
      startDate = null; // Không giới hạn thời gian bắt đầu
      break;
    default:
      throw new AppError(
        "Invalid timeRange. Use '7days', '28days', or 'all'",
        400
      );
  }

  // Sử dụng native MongoDB driver
  const db = mongoose.connection.db;
  let pipeline = [
    {
      $match: {
        $or: [{ user_id: objectId }, { business_id: objectId }],
      },
    },
  ];

  // Thêm điều kiện thời gian nếu không phải "all"
  if (startDate) {
    pipeline[0].$match.createdAt = { $gte: startDate };
  }

  // Debug: Log toàn bộ dữ liệu thô trước khi nhóm
  const rawData = await db.collection("posts").aggregate(pipeline).toArray();
  console.log(
    "Raw Data (native):",
    rawData.map((post) => ({
      _id: post._id,
      user_id: post.user_id,
      business_id: post.business_id,
      deleted: post.deleted,
      createdAt: post.createdAt,
      deletedAt: post.deletedAt,
    }))
  );

  // Logic nhóm dữ liệu theo timeRange
  if (timeRange === "7days") {
    pipeline.push(
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } }
    );

    const frequency = await db
      .collection("posts")
      .aggregate(pipeline)
      .toArray();

    const result = Array(7).fill(0);
    const today = new Date();
    const dates = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(today);
      d.setDate(today.getDate() - (6 - i));
      return d.toISOString().split("T")[0];
    });

    frequency.forEach((item) => {
      const index = dates.indexOf(item._id);
      if (index !== -1) result[index] = item.count;
    });
    return result;
  } else if (timeRange === "28days") {
    pipeline.push(
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } }
    );

    const frequency = await db
      .collection("posts")
      .aggregate(pipeline)
      .toArray();

    const result = Array(28).fill(0);
    const today = new Date();
    const dates = Array.from({ length: 28 }, (_, i) => {
      const d = new Date(today);
      d.setDate(today.getDate() - (27 - i));
      return d.toISOString().split("T")[0];
    });

    frequency.forEach((item) => {
      const index = dates.indexOf(item._id);
      if (index !== -1) result[index] = item.count;
    });
    return result;
  } else if (timeRange === "all") {
    pipeline.push(
      {
        $group: {
          _id: { $year: "$createdAt" },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } }
    );

    const frequency = await db
      .collection("posts")
      .aggregate(pipeline)
      .toArray();

    const minYear = frequency.length > 0 ? frequency[0]._id : now.getFullYear();
    const maxYear =
      frequency.length > 0
        ? frequency[frequency.length - 1]._id
        : now.getFullYear();
    const yearRange = maxYear - minYear + 1;
    const result = Array(yearRange).fill(0);
    frequency.forEach((item) => {
      result[item._id - minYear] = item.count;
    });
    return {
      years: Array.from({ length: yearRange }, (_, i) => minYear + i),
      counts: result,
    };
  }
};
const getPostSummaryService = async (id, timeRange = "7days") => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError("Invalid user or business ID", 400);
  }

  const objectId = new mongoose.Types.ObjectId(id);
  let startDate;

  // Xác định khoảng thời gian dựa trên timeRange
  const now = new Date();
  switch (timeRange.toLowerCase()) {
    case "7days":
      startDate = new Date(now.setDate(now.getDate() - 7)); // 7 ngày qua
      break;
    case "28days":
      startDate = new Date(now.setDate(now.getDate() - 28)); // 28 ngày qua
      break;
    case "all":
      startDate = null; // Không giới hạn thời gian bắt đầu
      break;
    default:
      throw new AppError(
        "Invalid timeRange. Use '7days', '28days', or 'all'",
        400
      );
  }

  // Điều kiện cơ bản, bao gồm cả bài đã xóa mềm
  let matchCondition = {
    $or: [{ user_id: objectId }, { business_id: objectId }],
    // Không thêm điều kiện deleted để lấy cả bài đã xóa mềm
  };

  // Thêm điều kiện thời gian nếu không phải "all"
  if (startDate) {
    matchCondition.createdAt = { $gte: startDate };
  }

  // Tổng số bài viết, bao gồm cả đã xóa mềm
  const totalPosts = await Post.countDocumentsWithDeleted(matchCondition);

  // Tổng số lượt thích, bao gồm cả bài đã xóa mềm
  const totalLikes = await User_Like_Post.aggregate([
    {
      $lookup: {
        from: "posts",
        localField: "post_id",
        foreignField: "_id",
        as: "post",
      },
    },
    { $unwind: "$post" },
    {
      $match: {
        $or: [{ "post.user_id": objectId }, { "post.business_id": objectId }],
        ...(startDate ? { "post.createdAt": { $gte: startDate } } : {}),
      },
    },
    { $group: { _id: null, total: { $sum: 1 } } },
  ]);

  // Tổng số bình luận, bao gồm cả bài đã xóa mềm
  const totalComments = await Comment.aggregate([
    {
      $lookup: {
        from: "posts",
        localField: "post_id",
        foreignField: "_id",
        as: "post",
      },
    },
    { $unwind: "$post" },
    {
      $match: {
        $or: [{ "post.user_id": objectId }, { "post.business_id": objectId }],
        ...(startDate ? { "post.createdAt": { $gte: startDate } } : {}),
      },
    },
    { $group: { _id: null, total: { $sum: 1 } } },
  ]);

  return {
    totalPosts,
    totalLikes: totalLikes[0]?.total || 0,
    totalComments: totalComments[0]?.total || 0,
  };
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
  getPostFrequencyService,
  getPostSummaryService,
};
