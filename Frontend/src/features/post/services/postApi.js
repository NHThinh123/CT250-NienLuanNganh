import axios from "../../../services/axios.customize";

const getPostApi = () => {
  const URL_API = "/api/posts";
  return axios.get(URL_API);
};

const createPostApi = (data) => {
  const URL_API = "/api/posts/create";
  return axios.post(URL_API, data);
};
export { getPostApi, createPostApi };
