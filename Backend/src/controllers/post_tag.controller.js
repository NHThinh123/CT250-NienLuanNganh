const {
  addTagToPostService,
  getPostByTagService,
  getTagByPostService,
  deleteTagFromPostService,
} = require("../services/post_tag.service");

const addTagToPost = async (req, res, next) => {
  try {
    const { post_id, tag_id } = req.body;
    const data = await addTagToPostService(post_id, tag_id);
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

const getPostByTag = async (req, res, next) => {
  try {
    const { tag_id } = req.params;
    const data = await getPostByTagService(tag_id);
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

const getTagByPost = async (req, res, next) => {
  try {
    const { post_id } = req.params;
    const data = await getTagByPostService(post_id);
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

const deleteTagFromPost = async (req, res, next) => {
  try {
    const { post_id, tag_id } = req.body;
    const data = await deleteTagFromPostService(post_id, tag_id);
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  addTagToPost,
  getPostByTag,
  getTagByPost,
  deleteTagFromPost,
};
