import React, { useState } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import axios from "../../../../services/axios.customize"
import { Button, Form, Typography } from "antd";

const { Title } = Typography;

const PaymentForm = ({
    businessId,
    amount,
    planType,
    email,
    businessName,
    onPaymentSuccess,
    fromBusinessDetail,
}) => {
    const stripe = useStripe();
    const elements = useElements();
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    console.log("PaymentForm rendered, stripe:", stripe, "loading:", loading);

    const handleSubmit = async () => {
        console.log("handleSubmit triggered");
        setLoading(true);
        setError(null);

        if (!stripe || !elements) {
            console.log("Stripe or Elements not initialized");
            setError("Stripe chưa được khởi tạo.");
            setLoading(false);
            return;
        }

        try {
            console.log("Creating payment method...");
            const { paymentMethod, error: paymentMethodError } = await stripe.createPaymentMethod({
                type: "card",
                card: elements.getElement(CardElement),
                billing_details: { email },
            });

            if (paymentMethodError) {
                console.log("Stripe error:", paymentMethodError.message);
                setError(paymentMethodError.message);
                setLoading(false);
                return;
            }

            console.log("Payment method created:", paymentMethod.id);

            const apiUrl = fromBusinessDetail
                ? `/api/businesss/payment/monthly/${businessId}`
                : `/api/businesss/payment/activation/${businessId}`;
            console.log("Sending request to API:", {
                url: apiUrl,
                businessId,
                paymentMethodId: paymentMethod.id,
                amount,
                planType,
                email,
                businessName,
            });

            const responseData = await axios.post(apiUrl, {
                paymentMethodId: paymentMethod.id,
                amount,
                planType,
                email,
                businessName,
            });

            console.log("API response:", responseData);

            if (!responseData) {
                throw new Error("Không nhận được phản hồi từ server.");
            }

            const { message, business } = responseData; // Destructure trực tiếp từ responseData
            if (!business) {
                console.error("Business data missing in response:", responseData);
                setError("Dữ liệu doanh nghiệp không hợp lệ từ server.");
                setLoading(false);
                return;
            }

            console.log("Calling onPaymentSuccess with:", { business });
            onPaymentSuccess({ business });
            setLoading(false);
        } catch (err) {
            console.error("Payment error:", err.message || err);
            setError(err.message || "Đã xảy ra lỗi trong quá trình thanh toán.");
            setLoading(false);
        }
    };

    return (
        <Form
            form={form}
            onFinish={handleSubmit}
            style={{ maxWidth: 400, margin: "0 auto" }}
        >
            <Title level={3}>Thanh toán</Title>
            <p>Số tiền: ${amount}</p>
            <p>Gói: {planType}</p>
            <p>Email: {email}</p>
            <p>Tên doanh nghiệp: {businessName}</p>
            <CardElement options={{ style: { base: { fontSize: "16px" } } }} />
            {error && <p style={{ color: "red", marginTop: "10px" }}>{error}</p>}
            <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                disabled={!stripe || loading}
                style={{ marginTop: 20 }}
            >
                Thanh toán ngay
            </Button>
        </Form>
    );
};

export default PaymentForm;