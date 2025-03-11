const mongoose = require("mongoose");
const Post = require("../models/post.model");
const User = require("../models/user.model");
const Business = require("../models/business.model");
const AppError = require("../utils/AppError");
const Asset = require("../models/asset.model");
const Post_Tag = require("../models/post_tag.model");
const { createTagService } = require("./tag.service");
const Tag = require("../models/tag.model");

require("dotenv").config();

const getListPostService = async ({
  id, // Thay user_id và business_id bằng id duy nhất
  search,
  sort,
  filter,
  page = 1,
  limit = 10,
}) => {
  // Kiểm tra hợp lệ ObjectId cho id
  const isValidId = id ? mongoose.Types.ObjectId.isValid(id) : false;
  const objectId = isValidId ? new mongoose.Types.ObjectId(id) : null;

  let pipeline = [];

  /** 1. MATCH - Áp dụng bộ lọc không liên quan đến tags trước */
  let initialMatchConditions = {};
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

  /** 2. LOOKUP - Kết hợp dữ liệu từ các bảng liên quan */
  pipeline.push(
    {
      $lookup: {
        from: "users",
        localField: "user_id",
        foreignField: "_id",
        as: "user",
      },
    },
    {
      $unwind: {
        path: "$user",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $lookup: {
        from: "businesses",
        localField: "business_id",
        foreignField: "_id",
        as: "business",
      },
    },
    {
      $unwind: {
        path: "$business",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $lookup: {
        from: "assets",
        localField: "_id",
        foreignField: "post_id",
        as: "images",
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

  /** 3. MATCH - Áp dụng bộ lọc tags nếu có */
  let totalMatchConditions = { ...initialMatchConditions };
  if (filter?.tags) {
    pipeline.push({
      $match: {
        "tags.tag_name": { $in: filter.tags },
      },
    });
    totalMatchConditions["tags.tag_name"] = { $in: filter.tags };
  }

  /** 4. GROUP - Loại bỏ trùng lặp và giữ lại dữ liệu cần thiết */
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
      updatedAt: { $first: "$updatedAt" },
      images: { $first: "$images" },
      tags: { $first: "$tags" },
      likes: { $first: "$likes" },
      comments: { $first: "$comments" },
    },
  });

  /** 5. ADD FIELDS - Tính toán số like, comment và trạng thái like */
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
  });

  /** 6. SORT - Sắp xếp theo yêu cầu */
  let sortOptions = { createdAt: -1 };
  if (sort === "oldest") sortOptions = { createdAt: 1 };
  if (sort === "most_likes") sortOptions = { likeCount: -1, createdAt: -1 };
  if (sort === "most_comments")
    sortOptions = { commentCount: -1, createdAt: -1 };
  pipeline.push({ $sort: sortOptions });

  /** 7. PAGINATION - Phân trang */
  const skip = (parseInt(page) - 1) * parseInt(limit);
  pipeline.push({ $skip: skip }, { $limit: parseInt(limit) });

  /** 8. PROJECT - Lựa chọn trường cần trả về */
  pipeline.push({
    $project: {
      user_id: 1,
      business_id: 1,
      title: 1,
      content: 1,
      createdAt: 1,
      updatedAt: 1,
      images: 1,
      tags: 1,
      likeCount: 1,
      commentCount: 1,
      isLike: 1,
      author: 1,
    },
  });

  /** 9. EXECUTE QUERY */
  const result = await Post.aggregate(pipeline);

  /** 10. Tính tổng số bài viết */
  let countPipeline = [];
  if (Object.keys(initialMatchConditions).length > 0) {
    countPipeline.push({ $match: initialMatchConditions });
  }
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
    }
  );
  if (filter?.tags) {
    countPipeline.push({
      $match: {
        "tags.tag_name": { $in: filter.tags },
      },
    });
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
  filter = {}, // Thêm mặc định để tránh undefined
}) => {
  console.log("Params received:", { id, search, sort, page, limit, filter });

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError("Invalid user ID", 400);
  }

  const objectId = new mongoose.Types.ObjectId(id);

  const result = await getListPostService({
    id,
    search,
    sort,
    filter: {
      id, // Lọc theo ID của user/business
      ...filter, // Gộp thêm các filter khác (như tags) nếu có
    },
    page,
    limit,
  });

  return result;
};
const getPostByIdService = async (post_id, id) => {
  if (!mongoose.Types.ObjectId.isValid(post_id)) {
    throw new AppError("Invalid post ID", 400);
  }

  const isValidId = id ? mongoose.Types.ObjectId.isValid(id) : false;
  const objectId = isValidId ? new mongoose.Types.ObjectId(id) : null;

  let result = await Post.aggregate([
    {
      $match: { _id: new mongoose.Types.ObjectId(post_id) },
    },
    {
      $lookup: {
        from: "users",
        localField: "user_id",
        foreignField: "_id",
        as: "user",
      },
    },
    {
      $unwind: {
        path: "$user",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $lookup: {
        from: "businesses",
        localField: "business_id",
        foreignField: "_id",
        as: "business",
      },
    },
    {
      $unwind: {
        path: "$business",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $lookup: {
        from: "assets",
        localField: "_id",
        foreignField: "post_id",
        as: "images",
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
        createdAt: 1,
        updatedAt: 1,
        images: 1,
        tags: 1,
        likeCount: 1,
        commentCount: 1,
        isLike: 1,
        author: 1,
      },
    },
  ]);

  if (!result || result.length === 0) {
    throw new AppError("Post not found", 404);
  }

  return result[0];
};
const createPostService = async (id, title, content, tags, files) => {
  if (!title || !content) {
    throw new AppError("Missing required fields", 400);
  }

  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError("A valid ID must be provided", 400);
  }

  const objectId = new mongoose.Types.ObjectId(id);

  // Kiểm tra xem id thuộc về user hay business
  const user = await User.findById(objectId);
  const business = await Business.findById(objectId);

  if (!user && !business) {
    throw new AppError("ID does not belong to any user or business", 404);
  }

  let result = await Post.create({
    user_id: user ? objectId : null,
    business_id: business ? objectId : null,
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
  getMyPostsService,
};
