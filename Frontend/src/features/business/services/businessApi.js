import axios from "../../../services/axios.customize";

//Đăng nhập
const loginBusiness = (data) => {
  const URL_API = "/api/businesss/loginBusiness";
  console.log("api", data);
  return axios.post(URL_API, data);
};

export { loginBusiness };
