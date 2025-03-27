import { useMutation } from "@tanstack/react-query";
import { updateBusinessApi } from "../services/businessApi";
import { message } from "antd";

export const useUpdateProfileBusiness = (options = {}) => {
    return useMutation({
        mutationFn: async (variables) => {
            const { id, data } = variables;
            const response = await updateBusinessApi(id, data); // Gọi API

            // Kiểm tra phản hồi từ backend
            if (response?.error) {
                throw new Error(response.error); // Ném lỗi nếu có trường error
            }

            return response; // Trả về dữ liệu nếu thành công
        },
        onError: (error) => {
            const errorMessage = error.message;
            if (errorMessage === "Mật khẩu cũ không đúng!") {
                message.error("Mật khẩu cũ không chính xác, vui lòng kiểm tra lại!");
            } else {
                message.error("Cập nhật thất bại, vui lòng thử lại!");
            }
            console.error("Update profile business error:", error);
            options.onError?.(error);
        },
        onSuccess: (data) => {
            message.success("Cập nhật thông tin thành công!");
            options.onSuccess?.(data);
        },
    });
};