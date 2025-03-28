const {
  updateRatingAverageService,
  updateTotalReviewsService,
} = require("../services/business.service");
const {
  getListReviewService,
  createReviewService,
  getReviewByIdService,
  getNumberOfReviewsByBusinessIdService,
  deleteReviewService,
  getReviewsByBusinessIdService,
  getReviewResponseByParentReviewIdService,
} = require("../services/review.service");

const getListReview = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, search = "" } = req.query;
    const data = await getListReviewService(
      Number(page),
      Number(limit),
      search
    );
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
    const {
      business_id,
      review_rating,
      review_contents,
      user_id,
      business_id_review,
      parent_review_id,
      business_id_feedback,
    } = req.body;

    const newReview = await createReviewService(
      business_id,
      review_rating,
      review_contents,
      user_id,
      business_id_review,
      parent_review_id,
      business_id_feedback,
      req.files
    );
    if (business_id && review_rating) {
      await updateRatingAverageService(business_id); //Cập nhật lại rating_average khi tạo một review
      await updateTotalReviewsService(business_id); //Cập nhật lại số lượng review của business khi tạo một review
    }

    res.status(201).json(newReview);
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
    await updateTotalReviews(data.business_id); //Cập nhật lại số lượng review của business khi tạo một review
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

const getReviewsByBusinessId = async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = await getReviewsByBusinessIdService(id);
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

const getReviewResponseByParentReviewId = async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = await getReviewResponseByParentReviewIdService(id);
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

const getNumberOfReviewsByBusinessId = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: "Business ID is required" });
    }

    const totalReviews = await getNumberOfReviewsByBusinessIdService(id);

    return res.status(200).json({ totalReviews });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getListReview,
  getReviewById,
  createReview,
  getNumberOfReviewsByBusinessId,
  deleteReview,
  getReviewsByBusinessId,
  getReviewResponseByParentReviewId,
};
