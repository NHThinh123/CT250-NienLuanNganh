import { useMutation } from "@tanstack/react-query";
import { useContext } from "react";
import { AuthContext } from "../../../contexts/auth.context";
import { loginUser } from "../services/userApi";
import { useNavigate } from "react-router-dom";
import { message } from "antd";
import { dayjs } from "dayjs";

export const useLogin = () => {
  const { setAuth } = useContext(AuthContext);
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (a) => loginUser(a),
    onSuccess: (data) => {
      console.log(data);
      if (data.status !== "SUCCESS") {
        message.error(data.message || "Đăng nhập thất bại!");
        return;
      }

      // Nếu đăng nhập thành công
      const userData = {
        id: data.user.id,
        email: data.user.email,
        role: data.user.role,
        name: data.user.name,
        avatar: data.user.avatar || "", // Nếu không có avatar thì để chuỗi rỗng
        dateOfBirth: data.user.dateOfBirth,
      };

      setAuth({ isAuthenticated: true, user: userData });
      localStorage.setItem("authUser", JSON.stringify(userData));

      message.success("Đăng nhập thành công!");
      navigate("/");
      console.log(userData);
    },
    onError: (error) => {
      // Xử lý lỗi khi không nhận được phản hồi thành công
      message.error(error.message || "Đăng nhập thất bại!");
    },
  });
};
