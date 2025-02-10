const {
  likePostService,
  unlikePostService,
  getUserLikePostService,
  getPostLikeByUserService,
} = require("../services/user_like_post.service");

const likePost = async (req, res, next) => {
  try {
    const { user_id, post_id } = req.body;
    const data = await likePostService(user_id, post_id);
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

const unlikePost = async (req, res, next) => {
  try {
    const { user_id, post_id } = req.body;
    const data = await unlikePostService(user_id, post_id);
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

const getUserLikePost = async (req, res, next) => {
  try {
    const { post_id } = req.params;
    const data = await getUserLikePostService(post_id);
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

const getPostLikeByUser = async (req, res, next) => {
  try {
    const { user_id } = req.params;
    const data = await getPostLikeByUserService(user_id);
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  likePost,
  unlikePost,
  getUserLikePost,
  getPostLikeByUser,
};
