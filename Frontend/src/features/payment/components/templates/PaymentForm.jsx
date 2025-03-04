// features/payment/components/PaymentForm.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Col, Button, Spin, Alert, Input } from "antd";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { usePayment } from "../../hooks/usePayment";


const PaymentForm = ({ businessId }) => {
    const stripe = useStripe();
    const elements = useElements();
    const navigate = useNavigate();
    const { mutate: processPayment, isPending, error } = usePayment(businessId);
    const [paymentError, setPaymentError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setPaymentError(null);

        if (!stripe || !elements) {
            setPaymentError("Stripe chưa sẵn sàng. Vui lòng đợi.");
            return;
        }

        const cardElement = elements.getElement(CardElement);
        if (!cardElement) {
            setPaymentError("Không tìm thấy thông tin thẻ. Vui lòng thử lại.");
            return;
        }

        const { paymentMethod, error: stripeError } = await stripe.createPaymentMethod({
            type: "card",
            card: cardElement,
        });

        if (stripeError) {
            setPaymentError(stripeError.message);
            return;
        }

        processPayment(
            {
                paymentMethodId: paymentMethod.id,
                amount: 500000, // Phí kích hoạt (có thể lấy từ backend)
            },
            {
                onSuccess: () => {
                    navigate("/loginBusiness"); // Chuyển hướng sau khi thanh toán thành công (tùy bạn)
                },
                onError: (err) => {
                    setPaymentError(err.response?.data?.message || "Thanh toán thất bại.");
                },
            }
        );
    };

    return (
        <Col xs={24} md={12} style={{ padding: "50px", backgroundColor: "#f0f2f5" }}>
            <div
                style={{
                    maxWidth: "500px",
                    margin: "0 auto",
                    padding: "30px",
                    backgroundColor: "#ffffff",
                    border: "1px solid #e8e8e8",
                    borderRadius: "8px",
                    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
                }}
            >
                <h3 style={{ textAlign: "center", marginBottom: "20px" }}>
                    Thanh toán phí kích hoạt tài khoản
                </h3>
                {error && (
                    <Alert
                        message="Lỗi"
                        description={error.response?.data?.message || "Có lỗi xảy ra. Vui lòng thử lại."}
                        type="error"
                        showIcon
                        style={{ marginBottom: "20px" }}
                    />
                )}
                {paymentError && (
                    <Alert
                        message="Lỗi thanh toán"
                        description={paymentError}
                        type="error"
                        showIcon
                        style={{ marginBottom: "20px" }}
                    />
                )}
                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: "20px" }}>
                        <label style={{ display: "block", marginBottom: "8px" }}>
                            Thông tin thẻ
                        </label>
                        <CardElement
                            options={{
                                style: {
                                    base: {
                                        fontSize: "16px",
                                        color: "#424770",
                                        "::placeholder": {
                                            color: "#aab7c4",
                                        },
                                    },
                                    invalid: {
                                        color: "#9e2146",
                                    },
                                },
                            }}
                        />
                    </div>
                    <div style={{ marginBottom: "20px" }}>
                        <label style={{ display: "block", marginBottom: "8px" }}>
                            Số tiền (VNĐ)
                        </label>
                        <Input value="500,000" disabled />
                    </div>
                    <Button
                        type="primary"
                        htmlType="submit"
                        disabled={!stripe || isPending}
                        loading={isPending}
                        block
                    >
                        {isPending ? "Đang xử lý..." : "Thanh toán"}
                    </Button>
                </form>
            </div>
        </Col>
    );
};

export default PaymentForm;