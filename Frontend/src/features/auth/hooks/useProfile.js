import { useMutation } from "@tanstack/react-query";
import { updateUser } from "../services/userApi";

export const useUpdateProfile = (options = {}) => {
    return useMutation({
        mutationFn: (variables) => {
            const { id, data } = variables;
            return updateUser(id, data);
        },
        onError: (error) => {
            console.error("Update profile error:", error);
            options.onError?.(error);
        },
        onSuccess: (data) => {
            options.onSuccess?.(data);
        },
    });
};
