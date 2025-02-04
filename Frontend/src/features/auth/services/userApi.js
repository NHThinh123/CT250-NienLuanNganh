import axios from "../../../services/axios.customize";

const getUserApi = () => {
  const URL_API = "/api/users/";
  return axios.get(URL_API);
};

export { getUserApi };
