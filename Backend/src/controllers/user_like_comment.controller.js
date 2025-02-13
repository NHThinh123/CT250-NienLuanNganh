const {
  likeCommentService,
  unlikeCommentService,
  getUserLikeCommentService,
  getCommentLikeByUserService,
} = require("../services/user_like_comment.service");

const likeComment = async (req, res, next) => {
  try {
    const { user_id, comment_id } = req.body;
    const data = await likeCommentService(user_id, comment_id);
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

const unlikeComment = async (req, res, next) => {
  try {
    const { user_id, comment_id } = req.body;
    const data = await unlikeCommentService(user_id, comment_id);
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

const getUserLikeComment = async (req, res, next) => {
  try {
    const { comment_id } = req.params;
    const data = await getUserLikeCommentService(comment_id);
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

const getCommentLikeByUser = async (req, res, next) => {
  try {
    const { user_id } = req.params;
    const data = await getCommentLikeByUserService(user_id);
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  likeComment,
  unlikeComment,
  getUserLikeComment,
  getCommentLikeByUser,
};
