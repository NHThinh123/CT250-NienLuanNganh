const {
  getListPostService,
  createPostService,
  getPostByIdService,
  updatePostService,
  deletePostService,
} = require("../services/post.service");

const getListPost = async (req, res, next) => {
  try {
    const { user_id, search, sort, filter, page, limit } = req.query;
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
      user_id,
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
    const { user_id, business_id, title, content, tags } = req.body;
    const parsedTags = tags ? JSON.parse(tags) : [];
    //console.log(user_id, title, content, parsedTags, req.files);
    const data = await createPostService(
      user_id,
      business_id,
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

const updatePost = async (req, res, next) => {
  try {
    const { id } = req.params;
    const dataUpdate = req.body;
    const data = await updatePostService(id, dataUpdate);
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};
const deletePost = async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = await deletePostService(id);
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
};
