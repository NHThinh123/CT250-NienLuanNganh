import { useMutation } from "@tanstack/react-query";
import { useContext } from "react";
import { AuthContext } from "../../../contexts/auth.context";
import { loginUser } from "../services/userApi";
import { useNavigate } from "react-router-dom";
import { message } from "antd";

export const useLogin = () => {
  const { setAuth } = useContext(AuthContext);
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (a) => loginUser(a),
    onSuccess: (data) => {
      if (data.status !== "SUCCESS") {
        message.error(data.message || "Đăng nhập thất bại!");
        return;
      }

      // Nếu đăng nhập thành công, bao gồm token trong userData
      const userData = {
        id: data.user.id,
        email: data.user.email,
        role: data.user.role,
        name: data.user.name,
        avatar:
          data.user.avatar ||
          "https://res.cloudinary.com/nienluan/image/upload/v1741015659/default-avatar-profile-icon-social-media-user-image-gray-avatar-icon-blank-profile-silhouette-illustration-vector_d3dgki.jpg",
        dateOfBirth: data.user.dateOfBirth,
        token: data.user.token, // Thêm token vào userData
      };

      setAuth({ isAuthenticated: true, user: userData });
      localStorage.setItem("authUser", JSON.stringify(userData));

      message.success("Đăng nhập thành công!");

      // Điều hướng dựa trên vai trò
      if (userData.role === "admin") {
        navigate("/admin");
      } else if (userData.role === "user") {
        navigate("/");
      } else {
        // Mặc định cho các vai trò khác (ví dụ: business), có thể điều hướng đến /profile hoặc giữ nguyên
        navigate("/profile");
      }

      console.log("User data saved:", userData);
    },
    onError: (error) => {
      message.error(error.message || "Đăng nhập thất bại!");
    },
  });
};