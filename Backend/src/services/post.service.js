const mongoose = require("mongoose");
const Post = require("../models/post.model");
const AppError = require("../utils/AppError");
const Asset = require("../models/asset.model");
const Post_Tag = require("../models/post_tag.model");
const { createTagService } = require("./tag.service");
const Tag = require("../models/tag.model");

require("dotenv").config();
const getListPostService = async ({
  user_id,
  business_id,
  search,
  sort,
  filter,
  page = 1,
  limit = 10,
}) => {
  // Kiểm tra hợp lệ ObjectId
  const isValidUserId = user_id
    ? mongoose.Types.ObjectId.isValid(user_id)
    : false;
  const isValidBusinessId = business_id
    ? mongoose.Types.ObjectId.isValid(business_id)
    : false;
  const userObjectId = isValidUserId
    ? new mongoose.Types.ObjectId(user_id)
    : null;
  const businessObjectId = isValidBusinessId
    ? new mongoose.Types.ObjectId(business_id)
    : null;

  let pipeline = [];

  /** 1. MATCH - Áp dụng bộ lọc không liên quan đến tags trước */
  let initialMatchConditions = {};
  if (filter?.user_id) {
    initialMatchConditions.user_id = new mongoose.Types.ObjectId(
      filter.user_id
    );
  }
  if (filter?.business_id) {
    initialMatchConditions.business_id = new mongoose.Types.ObjectId(
      filter.business_id
    );
  }
  if (search) {
    initialMatchConditions.$or = [
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
        preserveNullAndEmptyArrays: true, // Giữ lại document nếu không có user
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
        preserveNullAndEmptyArrays: true, // Giữ lại document nếu không có business
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
            $or: [
              { $in: [userObjectId, "$likes.user_id"] },
              { $in: [businessObjectId, "$likes.business_id"] },
            ],
          },
          then: 1,
          else: 0,
        },
      },
    },
  });

  /** 6. SORT - Sắp xếp theo yêu cầu */
  let sortOptions = { createdAt: -1 }; // Mặc định sắp xếp mới nhất
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
      "user.name": 1,
      "user.email": 1,
      "user.avatar": 1,
      "business.business_name": 1,
      "business.logo": 1,
      title: 1,
      content: 1,
      createdAt: 1,
      updatedAt: 1,
      images: 1,
      tags: 1,
      likeCount: 1,
      commentCount: 1,
      isLike: 1,
      entity: {
        $cond: {
          if: { $ne: ["$user_id", null] },
          then: {
            type: "user",
            id: "$user_id",
            name: "$user.name",
            avatar: "$user.avatar",
          },
          else: {
            type: "business",
            id: "$business_id",
            name: "$business.business_name",
            avatar: "$business.logo",
          },
        },
      },
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

const getPostByIdService = async (post_id, user_id) => {
  if (!mongoose.Types.ObjectId.isValid(post_id)) {
    throw new AppError("Invalid post ID", 400);
  }

  const isValidUserId = mongoose.Types.ObjectId.isValid(user_id);
  const userObjectId = isValidUserId
    ? new mongoose.Types.ObjectId(user_id)
    : null;

  let result = await Post.aggregate([
    {
      $match: { _id: new mongoose.Types.ObjectId(post_id) },
    },
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

  if (!result || result.length === 0) {
    throw new AppError("Post not found", 404);
  }

  return result[0]; // Trả về object thay vì array
};

const createPostService = async (
  user_id,
  business_id,
  title,
  content,
  tags,
  files
) => {
  if (!title || !content) {
    throw new AppError("Missing required fields", 400);
  }

  if (!user_id && !business_id) {
    throw new AppError(
      "At least one of user_id or business_id must be provided",
      400
    );
  }

  let result = await Post.create({
    user_id: user_id,
    business_id: business_id,
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
