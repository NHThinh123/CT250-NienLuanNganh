import axios from "../../../services/axios.customize";

const getPostApi = (user_id) => {
  const URL_API = `/api/posts/${user_id}`;
  return axios.get(URL_API);
};

const getPostByIdApi = (id) => {
  const URL_API = `/api/posts/${id}`;
  return axios.get(URL_API);
};
const createPostApi = (data) => {
  const URL_API = "/api/posts/create";
  return axios.post(URL_API, data);
};

const updatePostApi = (id, data) => {
  const URL_API = `/api/posts/${id}`;
  return axios.put(URL_API, data);
};

const deletePostApi = (id) => {
  const URL_API = `/api/posts/${id}`;
  return axios.delete(URL_API);
};

const likePostApi = (user_id, post_id) => {
  const URL_API = `api/user_like_post/like`;
  return axios.post(URL_API, { user_id, post_id });
};

export {
  getPostApi,
  createPostApi,
  getPostByIdApi,
  updatePostApi,
  deletePostApi,
  likePostApi,
};
