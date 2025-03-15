const {
  getListPostService,
  createPostService,
  getPostByIdService,
  updatePostService,
  deletePostService,
  getMyPostsService,
  getLikedPostsService,
  getCommentedPostsService,
} = require("../services/post.service");

const getListPost = async (req, res, next) => {
  try {
    const { id, search, sort, filter, page, limit } = req.query;
    let filterObj = {};

    // Kiểm tra và parse filter an toàn
    if (filter) {
      try {
        filterObj = typeof filter === "string" ? JSON.parse(filter) : filter;
      } catch (error) {
        return res.status(400).json({ message: "Invalid filter format" });
      }
    }

    const data = await getListPostService({
      id,
      search,
      sort,
      filter: filterObj, // Truyền filter object
      page,
      limit,
    });
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

const getPostById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { user_id } = req.query;
    const data = await getPostByIdService(id, user_id);
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};
const getLikedPosts = async (req, res, next) => {
  try {
    const { id, search, sort, page, limit, filter } = req.query;
    const data = await getLikedPostsService({
      id,
      search,
      sort,
      page,
      limit,
      filter,
    });
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

const getCommentedPosts = async (req, res, next) => {
  try {
    const { id, search, sort, page, limit, filter } = req.query;
    const data = await getCommentedPostsService({
      id,
      search,
      sort,
      page,
      limit,
      filter,
    });
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

const createPost = async (req, res, next) => {
  try {
    const { id, title, content, tags } = req.body;
    const parsedTags = tags ? JSON.parse(tags) : [];
    //console.log(user_id, title, content, parsedTags, req.files);
    const data = await createPostService(
      id,
      title,
      content,
      parsedTags,
      req.files
    );
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

const getMyPosts = async (req, res, next) => {
  try {
    const { id, search, sort, page, limit, filter } = req.query;

    const data = await getMyPostsService({
      id,
      search,
      sort,
      page,
      limit,
      filter,
    });

    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

const updatePost = async (req, res, next) => {
  try {
    const { post_id } = req.params;
    const { id, title, content, tags, deletedMediaIds } = req.body;
    const files = req.files;
    console.log("id", id);
    console.log("title", title);
    console.log("content", content);
    console.log("tags", tags);
    console.log("deletedMediaIds", deletedMediaIds);
    console.log("files", files);
    console.log("files", files);
    const parsedTags = tags ? JSON.parse(tags) : undefined;
    const parsedDeletedMediaIds = deletedMediaIds
      ? JSON.parse(deletedMediaIds)
      : [];

    const data = await updatePostService(post_id, id, {
      title,
      content,
      tags: parsedTags,
      deletedMediaIds: parsedDeletedMediaIds,
      files,
    });
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};
const deletePost = async (req, res, next) => {
  try {
    const { post_id } = req.params;
    const { id } = req.query;
    const data = await deletePostService(post_id, id);
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getListPost,
  getPostById,
  createPost,
  updatePost,
  deletePost,
  getMyPosts,
  getLikedPosts,
  getCommentedPosts,
};
