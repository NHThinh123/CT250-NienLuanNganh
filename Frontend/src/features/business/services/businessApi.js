import axios from "../../../services/axios.customize";

const getBusinessApi = () => {
  const URL_API = "/api/businesss";
  return axios.get(URL_API);
};

const getBusinessByIdApi = (id) => {
  const URL_API = `/api/businesss/id/${id}`;
  return axios.get(URL_API);
};

const createBusinessApi = (data) => {
  const URL_API = "/api/businesss";
  return axios.post(URL_API, data);
};

const updateBusinessApi = (id, data) => {
  const URL_API = `/api/businesss/${id}`;
  return axios.put(URL_API, data);
};

const deleteBusinessApi = (id) => {
  const URL_API = `/api/businesss/${id}`;
  return axios.delete(URL_API);
};

const signUpBusinessApi = (data) => {
  const URL_API = "/api/businesss/signupBusiness";
  return axios.post(URL_API, data);
};

const loginBusinessApi = (data) => {
  const URL_API = "/api/businesss/loginBusiness";
  return axios.post(URL_API, data);
};

export {
  getBusinessApi,
  getBusinessByIdApi,
  createBusinessApi,
  updateBusinessApi,
  deleteBusinessApi,
  signUpBusinessApi,
  loginBusinessApi,
};
