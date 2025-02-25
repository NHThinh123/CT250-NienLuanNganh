import axios from "../../../services/axios.customize";

const getCommentApi = (post_id) => {
  const URL_API = `/api/comments//post/${post_id}`;
  return axios.get(URL_API);
};

export { getCommentApi };
