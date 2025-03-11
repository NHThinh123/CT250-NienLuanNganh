import axios from "../../../services/axios.customize";

const getDishApi = () => {
  const URL_API = "/api/dishes";
  return axios.get(URL_API);
};

const getDishByIdApi = (id) => {
  const URL_API = `/api/dishes/${id}`;
  return axios.get(URL_API);
};

const createDishApi = (formData) => {
  const URL_API = "/api/dishes";
  return axios.post(URL_API, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

const updateDishApi = (id, data) => {
  const URL_API = `/api/dishes/${id}`;
  return axios.put(URL_API, data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

const deleteDishApi = (id) => {
  const URL_API = `/api/dishes/${id}`;
  return axios.delete(URL_API);
};

const getDishesByMenuIdApi = (id) => {
  const URL_API = `/api/dishes/getDishByMenuId/${id}`;
  return axios.get(URL_API);
};

export {
  getDishApi,
  getDishByIdApi,
  createDishApi,
  updateDishApi,
  deleteDishApi,
  getDishesByMenuIdApi,
};
