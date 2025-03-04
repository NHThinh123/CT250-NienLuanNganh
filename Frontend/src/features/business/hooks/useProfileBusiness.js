import { useMutation } from "@tanstack/react-query";
import { updateBusinessApi } from "../services/businessApi";

export const useUpdateProfileBusiness = (options = {}) => {
    return useMutation({
        mutationFn: (variables) => {
            const { id, data } = variables;
            return updateBusinessApi(id, data);
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
