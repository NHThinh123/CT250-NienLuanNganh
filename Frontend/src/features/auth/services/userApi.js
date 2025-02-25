import axios from "../../../services/axios.customize";

// API để đăng nhập
const loginUser = (data) => {
  const URL_API = "/api/user/login";
  console.log("api", data);
  return axios.post(URL_API, data);
};
//api đăng kí
const signupUser = (data) => {
  const URL_API = "/api/user/signup";
  return axios.post(URL_API, data);
};
//api cập nhật thông tin người dùng
const updateUser = (id, data) => {
  const URL_API = `/api/user/update/${id}`;
  return axios.put(URL_API, data, {
    headers: { "Content-Type": data instanceof FormData ? "multipart/form-data" : "application/json" },
  });
};
//api lấy id người dùng
const getUserProfile = (id) => {
  console.log(id);
  const URL_API = `/api/user/id/${id}`;
  return axios.get(URL_API);
};
export { loginUser, updateUser, getUserProfile, signupUser };
