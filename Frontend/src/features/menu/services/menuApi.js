import axios from "../../../services/axios.customize";

const getMenuApi = () => {
  const URL_API = "/api/menus";
  return axios.get(URL_API);
}

const getMenuByIdApi = (id) => {
    const URL_API = `/api/menus/${id}`;
    return axios.get(URL_API);
}

const createMenuApi = (data) => {
    const URL_API = "/api/menus";
    return axios.post(URL_API, data);
}

const updateMenuApi = (id, data) => {
    const URL_API = `/api/menus/${id}`;
    return axios.put(URL_API, data);
}

const deleteMenuApi = (id) => {
    const URL_API = `/api/menus/${id}`;
    return axios.delete(URL_API);
}

const getMenusByBusinessIdApi = (id) => {
    const URL_API = `/api/menus/getMenusByBusinessId/${id}`;
    return axios.get(URL_API);
}

export {
    getMenuApi,
    getMenuByIdApi,
    createMenuApi,
    updateMenuApi,
    deleteMenuApi,
    getMenusByBusinessIdApi
}