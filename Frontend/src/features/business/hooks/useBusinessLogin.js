import { useMutation } from "@tanstack/react-query";
import { useContext } from "react";
import { BusinessContext } from "../../../contexts/business.context";
import { AuthContext } from "../../../contexts/auth.context"; // Import AuthContext
import { loginBusinessApi } from "../services/businessApi";
import { useNavigate } from "react-router-dom";
import { message } from "antd";

const useBusinessLogin = () => {
  const { setBusiness } = useContext(BusinessContext);
  const { setAuth } = useContext(AuthContext); // Thêm setAuth
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (a) => loginBusinessApi(a),
    onSuccess: (data) => {
      console.log("✅ API trả về dữ liệu:", data);

      const businessData = {
        id: data.business.id,
        email: data.business.email,
        business_name: data.business.business_name,
        avatar:
          data.business.avatar ||
          "https://res.cloudinary.com/nienluan/image/upload/v1741015659/default-avatar-profile-icon-social-media-user-image-gray-avatar-icon-blank-profile-silhouette-illustration-vector_d3dgki.jpg",
        contact_info: data.business.contact_info,
        location: data.business.location,
        open_hours: data.business.open_hours,
        close_hours: data.business.close_hours,
      };
      console.log("Dữ liệu business trước khi set:", {
        isAuthenticated: true,
        business: businessData,
      });

      setBusiness({ isAuthenticated: true, business: businessData });
      setAuth({ isAuthenticated: false, user: {} }); // Reset auth
      localStorage.setItem(
        "authBusiness",
        JSON.stringify({ isAuthenticated: true, business: businessData })
      );
      localStorage.removeItem("authUser"); // Xóa authUser

      console.log(
        "💾 Dữ liệu sau khi lưu localStorage:",
        JSON.parse(localStorage.getItem("authBusiness"))
      );

      message.success("Đăng nhập thành công!");
      setTimeout(() => {
        navigate("/");
      }, 500);
    },
    onError: (error) => {
      message.error(error.message || "Đăng nhập thất bại!");
    },
  });
};

export default useBusinessLogin;
