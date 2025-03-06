// features/payment/components/PaymentForm.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Col, Button, Alert, Typography, Spin } from "antd";
import {
    CardNumberElement,
    CardExpiryElement,
    CardCvcElement,
    useStripe,
    useElements,
} from "@stripe/react-stripe-js";
import { usePayment } from "../../hooks/usePayment";
import {
    CreditCardOutlined,
    LockOutlined,
    InfoCircleOutlined,
    MailOutlined,
    ShopOutlined,
    CheckCircleOutlined,
} from "@ant-design/icons";

const { Text } = Typography;

const PaymentForm = ({ businessId, amount, email, businessName, planType }) => {
    const stripe = useStripe();
    const elements = useElements();
    const navigate = useNavigate();
    const { mutate: processPayment, isPending, error } = usePayment(businessId);
    const [paymentError, setPaymentError] = useState(null);
    const [paymentSuccess, setPaymentSuccess] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setPaymentError(null);
        setPaymentSuccess(false);

        if (!stripe || !elements) {
            setPaymentError("Stripe chưa sẵn sàng. Vui lòng đợi.");
            return;
        }

        const cardNumberElement = elements.getElement(CardNumberElement);
        const cardExpiryElement = elements.getElement(CardExpiryElement);
        const cardCvcElement = elements.getElement(CardCvcElement);

        if (!cardNumberElement || !cardExpiryElement || !cardCvcElement) {
            setPaymentError("Vui lòng nhập đầy đủ thông tin thẻ.");
            return;
        }

        const { paymentMethod, error: stripeError } = await stripe.createPaymentMethod({
            type: "card",
            card: cardNumberElement,
        });

        if (stripeError) {
            setPaymentError(stripeError.message);
            return;
        }

        processPayment(
            {
                paymentMethodId: paymentMethod.id,
                amount: Number(amount),
                planType
            },
            {
                onSuccess: () => {
                    setPaymentSuccess(true);
                    setTimeout(() => {
                        navigate("/loginBusiness");
                    }, 6000);
                },
                onError: (err) => {
                    setPaymentError(err.response?.data?.message || "Thanh toán thất bại.");
                },
            }
        );
    };

    const elementOptions = {
        style: {
            base: {
                fontSize: "16px",
                color: "#1a3353",
                "::placeholder": {
                    color: "#aab7c4",
                },
            },
            invalid: {
                color: "#ff4d4f",
                iconColor: "#ff4d4f",
            },
        },
    };

    return (
        <>
            {/* Overlay loading toàn màn hình */}
            {isPending && (
                <div
                    style={{
                        position: "fixed",
                        top: 0,
                        left: 0,
                        width: "100vw",
                        height: "100vh",
                        backgroundColor: "rgba(0, 0, 0, 0.5)",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        zIndex: 9999,
                    }}
                >
                    <Spin size="large" tip="Đang xử lý thanh toán..." />
                </div>
            )}

            <Col
                xs={24}
                md={12}
                style={{
                    padding: "50px",
                    //background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    minHeight: "100vh",
                }}
            >
                <div
                    style={{
                        maxWidth: "600px",
                        width: "100%",
                        padding: "30px",
                        backgroundColor: "#ffffff",
                        borderRadius: "12px",
                        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
                        border: "1px solid #e8ecef",
                        opacity: isPending ? 0.5 : 1,
                    }}
                >
                    {/* Tiêu đề */}
                    <div style={{ textAlign: "center", marginBottom: "15px", marginTop: "-5px" }}>
                        <CreditCardOutlined style={{ fontSize: "32px", color: "#1890ff" }} />
                        <h2 style={{ margin: "10px 0 5px", fontWeight: "bold", color: "#1a3353" }}>
                            Thanh toán phí
                        </h2>

                    </div>

                    {/* Thông báo thành công */}
                    {paymentSuccess && (
                        <Alert
                            message="Thanh toán thành công!"
                            description={`Phí thanh toán $${amount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} đã được thanh toán thành công. Bạn sẽ được chuyển hướng đến trang đăng nhập Business`}
                            type="success"
                            showIcon
                            icon={<CheckCircleOutlined />}
                            style={{ marginBottom: "20px", borderRadius: "8px" }}
                        />
                    )}

                    {/* Thông báo lỗi */}
                    {error && (
                        <Alert
                            message="Lỗi hệ thống"
                            description={error.response?.data?.message || "Có lỗi xảy ra."}
                            type="error"
                            showIcon
                            icon={<InfoCircleOutlined />}
                            style={{ marginBottom: "20px", borderRadius: "8px" }}
                        />
                    )}
                    {paymentError && (
                        <Alert
                            message="Lỗi thanh toán"
                            description={paymentError}
                            type="error"
                            showIcon
                            icon={<InfoCircleOutlined />}
                            style={{ marginBottom: "20px", borderRadius: "8px" }}
                        />
                    )}

                    <form onSubmit={handleSubmit}>
                        {/* Tên doanh nghiệp */}
                        <div style={{ marginBottom: "20px" }}>
                            <label
                                style={{
                                    display: "block",
                                    marginBottom: "8px",
                                    fontWeight: "500",
                                    color: "#1a3353",
                                }}
                            >
                                <ShopOutlined style={{ marginRight: "8px" }} />
                                Tên doanh nghiệp ẩm thực
                            </label>
                            <div
                                style={{
                                    padding: "12px",
                                    border: "1px solid #d9d9d9",
                                    borderRadius: "6px",
                                    backgroundColor: "#f5f5f5",
                                    color: "#1a3353",
                                }}
                            >
                                {businessName || "Không có thông tin"}
                            </div>
                        </div>

                        {/* Email */}
                        <div style={{ marginBottom: "20px" }}>
                            <label
                                style={{
                                    display: "block",
                                    marginBottom: "8px",
                                    fontWeight: "500",
                                    color: "#1a3353",
                                }}
                            >
                                <MailOutlined style={{ marginRight: "8px" }} />
                                Email
                            </label>
                            <div
                                style={{
                                    padding: "12px",
                                    border: "1px solid #d9d9d9",
                                    borderRadius: "6px",
                                    backgroundColor: "#f5f5f5",
                                    color: "#1a3353",
                                }}
                            >
                                {email || "Không có thông tin"}
                            </div>
                        </div>

                        {/* Số thẻ */}
                        <div style={{ marginBottom: "20px" }}>
                            <label
                                style={{
                                    display: "block",
                                    marginBottom: "8px",
                                    fontWeight: "500",
                                    color: "#1a3353",
                                }}
                            >
                                <CreditCardOutlined style={{ marginRight: "8px" }} />
                                Số thẻ tín dụng
                            </label>
                            <div
                                style={{
                                    padding: "12px",
                                    border: "1px solid #d9d9d9",
                                    borderRadius: "6px",
                                    backgroundColor: "#fafafa",
                                    transition: "border-color 0.3s",
                                }}
                            >
                                <CardNumberElement options={elementOptions} />
                            </div>
                        </div>

                        {/* MM/YY và CVC */}
                        <div style={{ display: "flex", gap: "16px", marginBottom: "20px" }}>
                            <div style={{ flex: 1 }}>
                                <label
                                    style={{
                                        display: "block",
                                        marginBottom: "8px",
                                        fontWeight: "500",
                                        color: "#1a3353",
                                    }}
                                >
                                    MM/YY
                                </label>
                                <div
                                    style={{
                                        padding: "12px",
                                        border: "1px solid #d9d9d9",
                                        borderRadius: "6px",
                                        backgroundColor: "#fafafa",
                                        transition: "border-color 0.3s",
                                    }}
                                >
                                    <CardExpiryElement options={elementOptions} />
                                </div>
                            </div>
                            <div style={{ flex: 1 }}>
                                <label
                                    style={{
                                        display: "block",
                                        marginBottom: "8px",
                                        fontWeight: "500",
                                        color: "#1a3353",
                                    }}
                                >
                                    CVC
                                </label>
                                <div
                                    style={{
                                        padding: "12px",
                                        border: "1px solid #d9d9d9",
                                        borderRadius: "6px",
                                        backgroundColor: "#fafafa",
                                        transition: "border-color 0.3s",
                                    }}
                                >
                                    <CardCvcElement options={elementOptions} />
                                </div>
                            </div>
                        </div>

                        {/* Số tiền */}
                        <div style={{ marginBottom: "25px" }}>
                            <label
                                style={{
                                    display: "block",
                                    marginBottom: "8px",
                                    fontWeight: "500",
                                    color: "#1a3353",
                                }}
                            >
                                Số tiền (USD)
                            </label>
                            <div
                                style={{
                                    padding: "12px",
                                    border: "1px solid #d9d9d9",
                                    borderRadius: "6px",
                                    backgroundColor: "#f5f5f5",
                                    fontSize: "16px",
                                    fontWeight: "bold",
                                    color: "#1a3353",
                                }}
                            >
                                ${amount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </div>
                        </div>

                        {/* Nút thanh toán */}
                        <Button
                            type="primary"
                            htmlType="submit"
                            disabled={!stripe || isPending}
                            loading={isPending}
                            block
                            size="large"
                            style={{
                                height: "35px",
                                fontSize: "16px",
                                borderRadius: "8px",
                                backgroundColor: "#1890ff",
                                borderColor: "#1890ff",
                                transition: "all 0.3s",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#40a9ff")}
                            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#1890ff")}
                        >
                            {isPending ? (
                                "Đang xử lý..."
                            ) : (
                                <>

                                    Thanh Toán
                                </>
                            )}
                        </Button>
                    </form>

                    {/* Bảo mật */}
                    <Text
                        type="secondary"
                        style={{
                            display: "block",
                            textAlign: "center",
                            marginTop: "15px",
                            fontSize: "12px",
                        }}
                    >
                        <LockOutlined /> Thanh toán được mã hóa và bảo mật bởi Stripe
                    </Text>
                </div>
            </Col>
        </>
    );
};

export default PaymentForm;