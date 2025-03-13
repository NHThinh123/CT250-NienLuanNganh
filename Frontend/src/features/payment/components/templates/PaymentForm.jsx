import React, { useState } from "react";
import { CardNumberElement, CardExpiryElement, CardCvcElement, useStripe, useElements } from "@stripe/react-stripe-js";
import axios from "../../../../services/axios.customize";
import { Button, Form, Typography, Card, Spin, Alert, Modal, Col } from "antd";
import "../../../../styles/PaymentForm.css"; // CSS tùy chỉnh
import { CheckCircleOutlined } from "@ant-design/icons";

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

            if (!responseData || !responseData.business) {
                throw new Error("Dữ liệu doanh nghiệp không hợp lệ từ server.");
            }

            onPaymentSuccess({ business: responseData.business });
            setSuccessModalVisible(true); // Hiển thị modal thành công
            setLoading(false);
        } catch (err) {
            setError(err.message || "Đã xảy ra lỗi trong quá trình thanh toán.");
            setLoading(false);
        }
    };

    // Hàm giả lập để kiểm tra thông báo thành công (dùng cho debug)
    const handleMockSuccess = () => {
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            setSuccessModalVisible(true); // Hiển thị modal thành công sau 2 giây
        }, 2000);
    };

    const handleModalOk = () => {
        setSuccessModalVisible(false);
    };

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
                        {/* Thông tin thanh toán */}
                        <div className="payment-details">
                            <Text strong>Số tiền: </Text>
                            <Text>${amount}</Text>
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

                        {/* Trường thông tin thẻ */}
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
                                />
                            </Form.Item>
                        </div>

                        {/* Hiển thị lỗi */}
                        {error && <Alert message={error} type="error" showIcon style={{ marginBottom: "20px" }} />}

                        {/* Nút thanh toán */}
                        <Button
                            type="primary"
                            htmlType="submit"
                            loading={loading}
                            disabled={!stripe || loading}
                            block
                            size="large"
                            style={{
                                borderRadius: "8px",
                                height: "35px",
                                fontSize: "16px",
                                background: loading ? "#d9d9d9" : "#52c41a",
                                border: "none",
                            }}
                        >
                            {loading ? <Spin /> : "Thanh toán"}
                        </Button>

                        {/* Nút giả lập để kiểm tra thông báo thành công */}
                        <Button
                            type="default"
                            onClick={handleMockSuccess}
                            block
                            size="large"
                            style={{
                                marginTop: "10px",
                                borderRadius: "8px",
                                height: "35px",
                                fontSize: "16px",
                            }}
                        >
                            Kiểm tra thông báo thành công
                        </Button>
                    </Form>
                </Card>

                {/* Modal thông báo thành công */}
                <Modal
                    visible={successModalVisible}
                    onOk={handleModalOk}
                    onCancel={handleModalOk}
                    footer={[
                        <Button key="ok" type="primary" onClick={handleModalOk}>
                            OK
                        </Button>,
                    ]}
                    centered
                >
                    <div style={{ textAlign: "center", padding: "20px" }}>
                        <CheckCircleOutlined style={{ fontSize: "40px", color: "#52c41a" }} />
                        <Title level={4} style={{ marginTop: "16px" }}>
                            Thanh toán thành công!
                        </Title>
                        <Text>Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi.</Text>
                    </div>
                </Modal>

                {/* Lớp phủ loading toàn màn hình */}
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