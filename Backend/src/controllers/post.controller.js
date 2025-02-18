const {
  getListPostService,
  createPostService,
  getPostByIdService,
  updatePostService,
  deletePostService,
} = require("../services/post.service");

const getListPost = async (req, res, next) => {
  try {
    const { user_id } = req.params;
    const data = await getListPostService(user_id);
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

const getPostById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { user_id } = req.body;
    const data = await getPostByIdService(id, user_id);
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

const createPost = async (req, res, next) => {
  try {
    const { user_id, title, content, tags } = req.body;
    const parsedTags = tags ? JSON.parse(tags) : [];
    const data = await createPostService(
      user_id,
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
