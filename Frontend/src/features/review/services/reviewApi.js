import axios from "../../../services/axios.customize";

const getReviewApi = () => {
  const URL_API = "/api/reviews";
  return axios.get(URL_API);
};

const getReviewByIdApi = (id) => {
  const URL_API = `/api/reviews/${id}`;
  return axios.get(URL_API);
};

const createReviewApi = (formData) => {
  const URL_API = "/api/reviews";
  return axios.post(URL_API, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

const deleteReviewApi = (id) => {
  const URL_API = `/api/reviews/${id}`;
  return axios.delete(URL_API);
};

const getReviewsByBusinessIdApi = (id) => {
  const URL_API = `/api/reviews/getReviewsByBusinessId/${id}`;
  return axios.get(URL_API);
};

const getReviewResponseByParentReviewId = (id) => {
  const URL_API = `/api/reviews/getReviewResponseByParentReviewId/${id}`;
  return axios.get(URL_API);
};

const getAssetReviewByBusinessId = (id) => {
  const URL_API = `/api/asset_reviews/getAssetReviewByBusinessId/${id}`;
  return axios.get(URL_API);
};

const getAssetReviewByReviewId = (id) => {
  const URL_API = `/api/asset_reviews/getAssetReviewByReviewId/${id}`;
  return axios.get(URL_API);
};

export {
  getReviewApi,
  getReviewByIdApi,
  createReviewApi,
  deleteReviewApi,
  getReviewsByBusinessIdApi,
  getReviewResponseByParentReviewId,
  getAssetReviewByBusinessId,
  getAssetReviewByReviewId,
};
