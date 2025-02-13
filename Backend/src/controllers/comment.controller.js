const {
  createCommentService,
  getListCommentByPostService,
  getCommentByIdService,
  getReplyByCommentService,
  updateCommentService,
  deleteCommentService,
} = require("../services/comment.service");

const createComment = async (req, res, next) => {
  try {
    const { user_id, post_id, parent_comment_id, comment_content } = req.body;
    const data = await createCommentService(
      user_id,
      post_id,
      parent_comment_id,
      comment_content
    );
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

const getListCommentByPost = async (req, res, next) => {
  try {
    const { post_id } = req.params;
    const data = await getListCommentByPostService(post_id);
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

const getCommentById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = await getCommentByIdService(id);
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

const getReplyByComment = async (req, res, next) => {
  try {
    const { comment_id } = req.params;
    const data = await getReplyByCommentService(comment_id);
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

const updateComment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const dataUpdate = req.body;
    const data = await updateCommentService(id, dataUpdate);
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

const deleteComment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = await deleteCommentService(id);
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createComment,
  getListCommentByPost,
  getCommentById,
  getReplyByComment,
  updateComment,
  deleteComment,
};
