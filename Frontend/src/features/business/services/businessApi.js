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
  const URL_API = `/api/businesss/id/${id}`;
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

const loginBusinessApi = (credentials) => {
  const URL_API = `/api/businesss/loginBusiness`;
  return axios.post(URL_API, credentials);
};
const requestBusinessResetPassword = (email) => {
  const URL_API = `/api/businesss/reset-password-request`;
  return axios.post(URL_API, email);
};
const fetchBillingData = async (businessId) => {
  try {
    const data = await axios.get(`/api/businesss/billing/${businessId}`);
    console.log("Fetched billing data:", data); // Debug dữ liệu thực tế

    if (!data) {
      return [];
    }
    return Array.isArray(data) ? data : [data];
  } catch (error) {
    console.error("Error fetching billing data:", error);
    return [];
  }
};

export {
  getBusinessApi,
  getBusinessByIdApi,
  createBusinessApi,
  updateBusinessApi,
  deleteBusinessApi,
  signUpBusinessApi,
  loginBusinessApi,
  requestBusinessResetPassword,
  fetchBillingData
};
