import axios from "../../../services/axios.customize";

const getReviewApi = () => {
  const URL_API = "/api/reviews";
  return axios.get(URL_API);
};

const getReviewByIdApi = (id) => {
  const URL_API = `/api/reviews/${id}`;
  return axios.get(URL_API);
};

const createReviewApi = (data) => {
  const URL_API = "/api/reviews";
  return axios.post(URL_API, data);
};

// const updateMenuApi = (id, data) => {
//   const URL_API = `/api/menus/${id}`;
//   return axios.put(URL_API, data);
// };

const deleteReviewApi = (id) => {
  const URL_API = `/api/reviews/${id}`;
  return axios.delete(URL_API);
};

const getReviewsByBusinessIdApi = (id) => {
  const URL_API = `/api/reviews/getReviewsByBusinessId/${id}`;
  return axios.get(URL_API);
};

export {
  getReviewApi,
  getReviewByIdApi,
  createReviewApi,
  deleteReviewApi,
  getReviewsByBusinessIdApi,
};
