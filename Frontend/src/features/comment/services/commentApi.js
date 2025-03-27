import axios from "../../../services/axios.customize";

const getCommentApi = (post_id, id) => {
  const URL_API = `/api/comments/`;
  return axios.get(URL_API, {
    params: {
      post_id,
      id,
    },
  });
};

const createCommentApi = (data) => {
  const URL_API = `/api/comments/create`;
  return axios.post(URL_API, data);
};

const likeCommentApi = (id, comment_id) => {
  const URL_API = `/api/user_like_comment/like`;
  return axios.put(URL_API, { id, comment_id });
};

const unlikeCommentApi = (id, comment_id) => {
  const URL_API = `/api/user_like_comment/unlike`;
  return axios.put(URL_API, { id, comment_id });
};

const getReplyCommentApi = (comment_id, id) => {
  const URL_API = `/api/comments/reply`;
  return axios.get(URL_API, {
    params: {
      comment_id,
      id,
    },
  });
};

const createReplyApi = (data) => {
  const URL_API = `/api/comments/create`;
  return axios.post(URL_API, data);
};

// Thêm API để cập nhật bình luận
const updateCommentApi = (comment_id, data) => {
  const URL_API = `/api/comments/${comment_id}`;
  return axios.put(URL_API, data);
};

// Thêm API để xóa bình luận
const deleteCommentApi = (comment_id) => {
  const URL_API = `/api/comments/${comment_id}`;
  return axios.delete(URL_API);
};

export {
  getCommentApi,
  createCommentApi,
  likeCommentApi,
  unlikeCommentApi,
  getReplyCommentApi,
  createReplyApi,
  updateCommentApi, // Xuất API mới
  deleteCommentApi, // Xuất API mới
};
