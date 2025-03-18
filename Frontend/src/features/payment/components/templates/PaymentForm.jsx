import React, { useState, useEffect } from "react";
import { CardNumberElement, CardExpiryElement, CardCvcElement, useStripe, useElements } from "@stripe/react-stripe-js";
import axios from "../../../../services/axios.customize";
import { Button, Form, Typography, Card, Spin, Alert, Modal, Col } from "antd";
import "../../../../styles/PaymentForm.css"; // CSS tùy chỉnh
import { CheckCircleOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const { Title, Text } = Typography;

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
    const [successModalVisible, setSuccessModalVisible] = useState(false);
    const [paymentCompleted, setPaymentCompleted] = useState(false);
    const navigate = useNavigate();

    // Log trạng thái successModalVisible để debug
    useEffect(() => {
        console.log("successModalVisible:", successModalVisible);
    }, [successModalVisible]);

    // Hàm xử lý thanh toán
    const handleSubmit = async () => {
        setLoading(true);
        setError(null);

        if (!stripe || !elements) {
            setError("Stripe chưa được khởi tạo.");
            setLoading(false);
            return;
        }

        try {
            const { paymentMethod, error: paymentMethodError } = await stripe.createPaymentMethod({
                type: "card",
                card: elements.getElement(CardNumberElement),
                billing_details: { email },
            });

            if (paymentMethodError) {
                console.error("Lỗi từ Stripe:", paymentMethodError);
                setError(paymentMethodError.message);
                setLoading(false);
                return;
            }

            const apiUrl = fromBusinessDetail
                ? `/api/businesss/payment/monthly/${businessId}`
                : `/api/businesss/payment/activation/${businessId}`;

            const responseData = await axios.post(apiUrl, {
                paymentMethodId: paymentMethod.id,
                amount,
                planType,
                email,
                businessName,
            });

            console.log("Phản hồi từ API:", responseData);

            if (!responseData || !responseData.business) {
                throw new Error("Dữ liệu doanh nghiệp không hợp lệ từ server.");
            }

            onPaymentSuccess({ business: responseData.business });
            setSuccessModalVisible(true); // Hiển thị modal thành công
            setPaymentCompleted(true);
            setLoading(false);
        } catch (err) {
            console.error("Lỗi trong handleSubmit:", err);
            setError(err.message || "Đã xảy ra lỗi trong quá trình thanh toán.");
            setLoading(false);
        }
    };

    // Hàm giả lập để kiểm tra thông báo thành công
    const handleMockSuccess = () => {
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            setSuccessModalVisible(true);
            setPaymentCompleted(true);
        }, 2000);
    };

    // Tạm thời đóng Modal thủ công để kiểm tra
    // const handleModalClose = () => {
    //     setSuccessModalVisible(false);
    //     navigate(`/business/${businessId}`); // Điều hướng sau khi đóng Modal
    // };

    // Tự động đóng Modal và điều hướng sau 2 giây (tạm thời comment để debug)
    /*
    useEffect(() => {
        if (successModalVisible) {
            const timer = setTimeout(() => {
                setSuccessModalVisible(false);
                navigate(`/business/${businessId}`);
            }, 2000);
            return () => clearTimeout(timer);
        }
    }, [successModalVisible, businessId, navigate]);
    */

    return (
        <Col xs={0} md={12} style={{ textAlign: "center" }}>
            <div className="payment-form-container">
                <Card
                    className="payment-card"
                    bordered={false}
                    style={{
                        maxWidth: 500,
                        margin: "0 auto",
                        borderRadius: "12px",
                        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                    }}
                >
                    <Title level={3} style={{ textAlign: "center", marginBottom: "24px" }}>
                        Thanh Toán
                    </Title>

                    <Form form={form} onFinish={handleSubmit} layout="vertical">
                        <div className="payment-details">
                            <Text strong>Số tiền: </Text>
                            <Text>{amount}vnd</Text>
                        </div>
                        <div className="payment-details">
                            <Text strong>Gói: </Text>
                            <Text>{planType}</Text>
                        </div>
                        <div className="payment-details">
                            <Text strong>Email: </Text>
                            <Text>{email}</Text>
                        </div>
                        <div className="payment-details">
                            <Text strong>Tên doanh nghiệp: </Text>
                            <Text>{businessName}</Text>
                        </div>

                        <Form.Item
                            label="Số thẻ"
                            rules={[{ required: true, message: "Vui lòng nhập số thẻ!" }]}
                            style={{ marginTop: "10px", marginBottom: "50px", height: "35px" }}
                        >
                            <CardNumberElement
                                options={{
                                    style: {
                                        base: {
                                            fontSize: "16px",
                                            color: "#424770",
                                            "::placeholder": { color: "#aab7c4" },
                                        },
                                        invalid: { color: "#ff4d4f" },
                                    },
                                }}
                                className="stripe-input"
                                disabled={paymentCompleted}
                            />
                        </Form.Item>

                        <div style={{ display: "flex", gap: "16px" }}>
                            <Form.Item
                                label="MM/YY"
                                rules={[{ required: true, message: "Vui lòng nhập ngày hết hạn!" }]}
                                style={{ flex: 1, height: "35px", marginBottom: "70px" }}
                            >
                                <CardExpiryElement
                                    options={{
                                        style: {
                                            base: {
                                                fontSize: "16px",
                                                color: "#424770",
                                                "::placeholder": { color: "#aab7c4" },
                                            },
                                            invalid: { color: "#ff4d4f" },
                                        },
                                    }}
                                    className="stripe-input"
                                    disabled={paymentCompleted}
                                />
                            </Form.Item>

                            <Form.Item
                                label="CVV"
                                rules={[{ required: true, message: "Vui lòng nhập mã CVV!" }]}
                                style={{ flex: 1, height: "35px", marginBottom: "70px" }}
                            >
                                <CardCvcElement
                                    options={{
                                        style: {
                                            base: {
                                                fontSize: "16px",
                                                color: "#424770",
                                                "::placeholder": { color: "#aab7c4" },
                                            },
                                            invalid: { color: "#ff4d4f" },
                                        },
                                    }}
                                    className="stripe-input"
                                    disabled={paymentCompleted}
                                />
                            </Form.Item>
                        </div>

                        {error && <Alert message={error} type="error" showIcon style={{ marginBottom: "20px" }} />}

                        <Button
                            type="primary"
                            htmlType="submit"
                            loading={loading}
                            disabled={!stripe || loading || paymentCompleted}
                            block
                            size="large"
                            style={{
                                borderRadius: "8px",
                                height: "35px",
                                fontSize: "16px",
                                background: loading || paymentCompleted ? "#d9d9d9" : "#52c41a",
                                border: "none",
                            }}
                        >
                            {loading ? <Spin /> : "Thanh toán"}
                        </Button>
                    </Form>
                </Card>

                {/* Modal thông báo thành công */}
                <Modal
                    visible={successModalVisible}
                    // footer={[
                    //     <Button key="ok" type="primary" onClick={handleModalClose}>
                    //         OK
                    //     </Button>,
                    // ]}
                    centered
                    width={400}
                    style={{ padding: "20px" }}
                >
                    <div style={{ textAlign: "center", padding: "20px" }}>
                        <CheckCircleOutlined style={{ fontSize: "50px", color: "#52c41a", marginBottom: "16px" }} />
                        <Title level={4} style={{ marginTop: "16px", color: "#333" }}>
                            Thanh toán thành công!
                        </Title>
                        <Text style={{ display: "block", marginBottom: "8px" }}>
                            Số tiền: <strong>{amount}vnd</strong>
                        </Text>
                        <Text style={{ display: "block", marginBottom: "8px" }}>
                            Gói: <strong>{planType}</strong>
                        </Text>
                        <Text style={{ display: "block", color: "#888" }}>
                            Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi!
                        </Text>
                    </div>
                </Modal>

                {loading && (
                    <div className="loading-overlay">
                        <Spin size="large" tip="Đang xử lý thanh toán..." />
                    </div>
                )}
            </div>
        </Col>
    );
};

export default PaymentForm;