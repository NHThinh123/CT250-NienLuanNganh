const {
  getListTagService,
  createTagService,
  deleteTagService,
} = require("../services/tag.service");

const getListTag = async (req, res, next) => {
  try {
    const data = await getListTagService();
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

const createTag = async (req, res, next) => {
  try {
    const { tag_name } = req.body;
    const data = await createTagService(tag_name);
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

const deleteTag = async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = await deleteTagService(id);
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getListTag,
  createTag,
  deleteTag,
};
