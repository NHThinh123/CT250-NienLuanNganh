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


      // Kiểm tra xem data có phải là lỗi không
      if (data.status !== "Loginsuccessful") {
        const errorMessage = data.message || "Đăng nhập thất bại";
        switch (errorMessage) {
          case "Tài khoản không tồn tại":
            message.error("Email không tồn tại!");
            break;
          case "Mật khẩu không chính xác":
            message.error("Mật khẩu không chính xác!");
            break;
          case "Email chưa được xác minh. Vui lòng kiểm tra hộp thư của bạn.":
            message.error("Email chưa được xác minh. Vui lòng kiểm tra hộp thư của bạn!");
            break;
          default:
            message.error(errorMessage);
            break;
        }
        return;
      }

      // Logic chỉ chạy khi đăng nhập thành công
      const businessData = {
        id: data.business.id,
        email: data.business.email,
        business_name: data.business.business_name,
        avatar: data.business.avatar || "https://...",
        contact_info: data.business.contact_info,
        location: data.business.location,
        open_hours: data.business.open_hours,
        close_hours: data.business.close_hours,
        status: data.business.status,
        verified: data.business.verified,
      };

      setBusiness({ isAuthenticated: true, business: businessData });
      setAuth({ isAuthenticated: false, user: {} });
      localStorage.setItem("authBusiness", JSON.stringify({ isAuthenticated: true, business: businessData }));
      localStorage.removeItem("authUser");

      if (businessData.verified === false) {
        message.info("Tài khoản chưa được kích hoạt. Vui lòng kiểm tra email để xác minh!");
        //navigate("/login");
      } else if (businessData.status === "pending") {
        message.info("Tài khoản chưa được kích hoạt. Vui lòng chọn gói dịch vụ để tiếp tục.");
        navigate(`/subscription/plans/${businessData.id}`, {
          state: { email: businessData.email, businessName: businessData.business_name },
        });
      } else if (businessData.status === "suspended") {
        message.info("Tài khoản đang bị tạm khóa. Vui lòng thanh toán để kích hoạt lại.");
        navigate(`/subscription/plans/${businessData.id}`, {
          state: { email: businessData.email, businessName: businessData.business_name },
        });
      } else {
        message.success("Đăng nhập thành công!");
        setTimeout(() => navigate("/"), 500);
      }
    },
    onError: (error) => {
      console.error("Lỗi đăng nhập chi tiết:", error);
      console.error("Phản hồi từ API:", error.response?.data);

      let errorMessage = "Có lỗi xảy ra khi đăng nhập. Vui lòng kiểm tra thông tin và thử lại!";
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
        switch (errorMessage) {
          case "Tài khoản không tồn tại":
            message.error("Email không tồn tại!");
            break;
          case "Mật khẩu không chính xác":
            message.error("Mật khẩu không chính xác!");
            break;
          case "Email chưa được xác minh. Vui lòng kiểm tra hộp thư của bạn.":
            message.error("Email chưa được xác minh. Vui lòng kiểm tra hộp thư của bạn!");
            break;
          default:
            message.error(errorMessage);
            break;
        }
      } else if (error.message) {
        message.error("Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng!");
      }
    },
  });
};

export default useBusinessLogin;