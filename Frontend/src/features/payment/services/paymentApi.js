import axios from "../../../services/axios.customize";

const processActivationPayment = (businessId, paymentData) => {
    const URL_API = `/api/businesss/payment/activation/${businessId}`;

    return axios.post(URL_API, paymentData, {
        headers: {
            "Content-Type": "application/json",
        },
    });
};

export { processActivationPayment };
