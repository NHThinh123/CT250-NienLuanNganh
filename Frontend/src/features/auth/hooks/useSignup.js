import { useMutation } from "@tanstack/react-query";
import { signupUser } from "../services/userApi";
import { useNavigate } from "react-router-dom";
import { message } from "antd";

export const useSignup = () => {
    const navigate = useNavigate();

    return useMutation({
        mutationFn: async (userData) => {
            const payload = { ...userData, role: "user" };
            const response = await signupUser(payload);
            return response; // Đảm bảo API trả về response đầy đủ
        },
        onSuccess: (response) => {
            // Kiểm tra phản hồi từ API
            if (response?.status === "PENDING") {
                // Trường hợp đăng ký thành công
                message.success("Vui lòng kiểm tra email để xác nhận tài khoản!");
                setTimeout(() => navigate("/login"), 2000);
            } else if (response?.message === "Email already exists") {
                // Trường hợp email đã tồn tại
                message.error("Email đã tồn tại. Vui lòng sử dụng email khác!");
            } else {
                // Các trường hợp lỗi khác
                message.error("Đăng ký thất bại. Vui lòng thử lại!");
            }
        },
        onError: (error) => {
            // Xử lý lỗi khi request thất bại hoàn toàn
            const errorMessage = error?.response?.data?.message;
            if (errorMessage === "Email already exists") {
                message.error("Email đã tồn tại. Vui lòng sử dụng email khác!");
            } else {
                message.error("Đăng ký thất bại. Vui lòng thử lại!");
                console.error("Đăng ký thất bại:", error);
            }
        },
    });
};