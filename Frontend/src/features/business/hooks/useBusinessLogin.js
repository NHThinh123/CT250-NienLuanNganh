
import { useMutation } from "@tanstack/react-query";
import { useContext } from "react";
import { BusinessContext } from "../../../contexts/business.context";
import { AuthContext } from "../../../contexts/auth.context";
import { loginBusinessApi } from "../services/businessApi";
import { useNavigate } from "react-router-dom";
import { message } from "antd";

const useBusinessLogin = () => {
  const { setBusiness } = useContext(BusinessContext);
  const { setAuth } = useContext(AuthContext);
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (credentials) => loginBusinessApi(credentials),
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
        status: data.business.status,
      };
      console.log("Dữ liệu business trước khi set:", {
        isAuthenticated: true,
        business: businessData,
      });

      // Lưu thông tin vào BusinessContext và localStorage
      setBusiness({ isAuthenticated: true, business: businessData });
      setAuth({ isAuthenticated: false, user: {} });
      localStorage.setItem(
        "authBusiness",
        JSON.stringify({ isAuthenticated: true, business: businessData })
      );
      localStorage.removeItem("authUser");

      console.log(
        "💾 Dữ liệu sau khi lưu localStorage:",
        JSON.parse(localStorage.getItem("authBusiness"))
      );

      // Kiểm tra status và hiển thị thông báo
      if (businessData.status === "pending") {
        message.info("Tài khoản của bạn chưa được kích hoạt. Vui lòng chọn gói dịch vụ để tiếp tục.");
        navigate(`/subscription/plans/${businessData.id}`, {
          state: {
            email: businessData.email,
            businessName: businessData.business_name,
          },
        });
      } else if (businessData.status === "suspended") {
        message.info("Tài khoản của bạn đang bị tạm khóa. Vui lòng thanh toán để kích hoạt lại.");
        navigate(`/subscription/plans/${businessData.id}`, {
          state: {
            email: businessData.email,
            businessName: businessData.business_name,
          },
        });
      } else {
        message.success("Đăng nhập thành công!");
        setTimeout(() => {
          navigate("/");
        }, 500);
      }
    },
    onError: (error) => {
      const errorMessage = error.response?.data?.message || "Đăng nhập thất bại. Vui lòng thử lại!";
      console.error("Login error:", errorMessage);
      message.error(errorMessage);
    },
  });
};

export default useBusinessLogin;
