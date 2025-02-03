import axios from "../../../services/axios.customize";

const getPostApi = () => {
  const URL_API = "/api/posts";
  return axios.get(URL_API);
};

export { getPostApi };
