const {
  getListPostService,
  createPostService,
  getPostByIdService,
  updatePostService,
  deletePostService,
  getMyPostsService,
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
    const { id, dataUpdate, tags } = req.body;
    const data = await updatePostService(
      post_id,
      id,
      dataUpdate,
      req.files,
      tags
    );
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
};
