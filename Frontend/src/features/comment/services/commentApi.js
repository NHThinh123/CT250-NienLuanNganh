import axios from "../../../services/axios.customize";

const getCommentApi = (post_id, user_id) => {
  const URL_API = `/api/comments/`;
  return axios.get(URL_API, {
    params: {
      post_id,
      user_id,
    },
  });
};
const createCommentApi = (data) => {
  const URL_API = `/api/comments/create`;
  return axios.post(URL_API, data);
};
const likeCommentApi = (user_id, comment_id) => {
  const URL_API = `/api/user_like_comment/like`;
  return axios.put(URL_API, { user_id, comment_id });
};
const unlikeCommentApi = (user_id, comment_id) => {
  const URL_API = `/api/user_like_comment/unlike`;
  return axios.put(URL_API, { user_id, comment_id });
};
const getReplyCommentApi = (comment_id, user_id) => {
  const URL_API = `/api/comments/reply`;
  return axios.get(URL_API, {
    params: {
      comment_id,
      user_id,
    },
  });
};
const createReplyApi = (data) => {
  const URL_API = `/api/comments/create`;
  return axios.post(URL_API, data);
};
export {
  getCommentApi,
  createCommentApi,
  likeCommentApi,
  unlikeCommentApi,
  getReplyCommentApi,
  createReplyApi,
};
