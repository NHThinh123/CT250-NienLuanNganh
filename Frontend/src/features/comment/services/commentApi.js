import axios from "../../../services/axios.customize";

const getCommentApi = (post_id) => {
  const URL_API = `/api/comments/`;
  return axios.get(URL_API, {
    params: {
      post_id,
    },
  });
};
const createCommentApi = (data) => {
  const URL_API = `/api/comments/create`;
  return axios.post(URL_API, data);
};

export { getCommentApi, createCommentApi };
