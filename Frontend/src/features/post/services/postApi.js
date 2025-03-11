import axios from "../../../services/axios.customize";

const getPostApi = ({ pageParam = 1, queryKey }) => {
  const [, params] = queryKey;
  const URL_API = `/api/posts`;
  return axios.get(URL_API, { params: { ...params, page: pageParam } });
};

const getPostByIdApi = (id, user_id) => {
  const URL_API = `/api/posts/detail/${id}`;
  return axios.get(URL_API, { params: { user_id } });
};
const createPostApi = (formData) => {
  const URL_API = "/api/posts/create";
  return axios.post(URL_API, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

const updatePostApi = (id, data) => {
  const URL_API = `/api/posts/${id}`;
  return axios.put(URL_API, data);
};

const deletePostApi = (id) => {
  const URL_API = `/api/posts/${id}`;
  return axios.delete(URL_API);
};

const likePostApi = (id, post_id) => {
  const URL_API = `api/user_like_post/like`;
  return axios.put(URL_API, { id, post_id });
};
const unlikePostApi = (id, post_id) => {
  const URL_API = `api/user_like_post/unlike`;
  return axios.put(URL_API, { id, post_id });
};
const getMyPostsApi = ({ pageParam = 1, queryKey }) => {
  const [, params] = queryKey;
  const URL_API = `/api/posts/my-posts`;
  return axios.get(URL_API, { params: { ...params, page: pageParam } });
};
export {
  getPostApi,
  createPostApi,
  getPostByIdApi,
  updatePostApi,
  deletePostApi,
  likePostApi,
  unlikePostApi,
  getMyPostsApi,
};
