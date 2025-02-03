const {
  getListPostService,
  createPostService,
  getPostByIdService,
  updatePostService,
  deletePostService,
} = require("../services/post.service");

const getListPost = async (req, res, next) => {
  try {
    const data = await getListPostService();
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

const getPostById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = await getPostByIdService(id);
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

const createPost = async (req, res, next) => {
  try {
    const { userId, title, content } = req.body;
    const data = await createPostService(userId, title, content);
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
