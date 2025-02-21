import { useMutation } from "@tanstack/react-query";
import { signupUser } from "../services/userApi";
import { useNavigate } from "react-router-dom";
import { message } from "antd";
export const useSignup = () => {
    const navigate = useNavigate();

    return useMutation({
        mutationFn: async (userData) => {
            const payload = { ...userData, role: "user" };
            return await signupUser(payload);
        },
        onSuccess: () => {
            message.success("Vui lòng kiểm tra email để xác nhận tài khoản!");
            navigate("/login");
        },
        onError: (error) => {
            message.error("Đăng ký thất bại. Vui lòng thử lại!");
            console.error("Đăng ký thất bại:", error);
        },
    });
};
