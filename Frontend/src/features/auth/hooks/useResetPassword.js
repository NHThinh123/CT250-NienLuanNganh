import { useMutation } from "@tanstack/react-query";
import { message } from "antd";
import { requestResetPassword } from "../services/userApi"; // Đổi tên API cho rõ ràng

export const useResetPassword = () => {
    return useMutation({
        mutationFn: async (email) => {
            return await requestResetPassword(email); // Chỉ gửi email lên server
        },
        onSuccess: () => {
            message.success("Vui lòng kiểm tra email để đặt lại mật khẩu!");
        },
        onError: (error) => {
            message.error(error?.response?.data?.message || "Có lỗi xảy ra. Vui lòng thử lại!");
            console.error("Lỗi gửi yêu cầu đặt lại mật khẩu:", error);
        },
    });
};
