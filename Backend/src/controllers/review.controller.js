const {
  getListReviewService,
  createReviewService,
  getReviewByIdService,
  // updateReviewService,
  deleteReviewService,
} = require("../services/review.service");

const getListReview = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, search = "" } = req.query;
    const data = await getListReviewService(Number(page), Number(limit), search);
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

const getReviewById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = await getReviewByIdService(id);
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

const createReview = async (req, res, next) => {
  try {
    const reviewData = req.body;
    const data = await createReviewService(reviewData);
    res.status(201).json(data);
  } catch (error) {
    next(error);
  }
};

// const updateReview = async (req, res, next) => {
//   try {
//     const { id } = req.params;
//     const dataUpdate = req.body;
//     const data = await updateReviewService(id, dataUpdate);
//     res.status(200).json(data);
//   } catch (error) {
//     next(error);
//   }
// };

const deleteReview = async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = await deleteReviewService(id);
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getListReview,
  getReviewById,
  createReview,
  // updateReview,
  deleteReview,
};
