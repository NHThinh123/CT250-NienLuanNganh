// features/register/hooks/useRegister.js
import { useMutation } from "@tanstack/react-query";
import { signUpBusinessApi } from "../services/businessApi";

export const useBusinessSignup = () => {
    return useMutation({
        mutationFn: signUpBusinessApi,
        onSuccess: (data) => {
            console.log("Đăng ký thành công:", data);
        },
        onError: (error) => {
            message.error(error.message || "Đăng nhập thất bại!");
        },
    });
};