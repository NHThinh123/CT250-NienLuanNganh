import { useMutation } from "@tanstack/react-query";
import { useContext } from "react";
import { BusinessContext } from "../../../contexts/business.context";
import { loginBusinessApi } from "../services/businessApi";
import { useNavigate } from "react-router-dom";
import { message } from "antd";


const useBusinessLogin = () => {
  const { setBusiness } = useContext(BusinessContext);
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (a) => loginBusinessApi(a),
    onSuccess: (data) => {
      console.log("✅ API trả về dữ liệu:", data);

      const businessData = {
        id: data.business.id,
        email: data.business.email,
        business_name: data.business.business_name,
        avatar: data.business.avatar || "",
        contact_info: data.business.contact_info,
        location: data.business.location,
        open_hours: data.business.open_hours,
        close_hours: data.business.close_hours,
      };

      console.log("🚀 Cập nhật BusinessContext với dữ liệu:", businessData);
      setBusiness({ isAuthenticated: true, business: businessData });

      localStorage.setItem("authBusiness", JSON.stringify({ isAuthenticated: true, business: businessData }));

      console.log("💾 Dữ liệu sau khi lưu localStorage:", JSON.parse(localStorage.getItem("authBusiness")));

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
