// features/payment/hooks/usePayment.js
import { useMutation } from "@tanstack/react-query";
import { processActivationPayment } from "../services/paymentApi";

export const usePayment = (businessId) => {
    return useMutation({
        mutationFn: (paymentData) => processActivationPayment(businessId, paymentData),
        onSuccess: (data) => {
            console.log("Thanh toán thành công:", data);
        },
        onError: (error) => {
            console.error("Lỗi thanh toán:", error);
        },
    });
};