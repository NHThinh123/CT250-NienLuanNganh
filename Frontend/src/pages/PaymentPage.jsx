import { useState, useEffect, useContext } from "react";
import { Row, Modal, Typography } from "antd";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import PaymentForm from "../features/payment/components/templates/PaymentForm";
import PaymentIllustration from "../features/payment/components/templates/PaymentIllustration";
import { BusinessContext } from "../contexts/business.context";

const stripePromise = loadStripe(
    "pk_test_51QyZcJGzZNrLHYHr52627BnMxat5xTfvscEgExFFySkrSJdDGEnTHUI5auCYCFrIuhzXSCsa1zERdiSdVNpcpPFs005y3lJIc9"
);

const { Title, Text } = Typography;

const PaymentPage = () => {
    const { businessId } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const { setBusiness } = useContext(BusinessContext);
    const { amount, planType, email, businessName, fromBusinessDetail } = location.state || {};

    const [successModalVisible, setSuccessModalVisible] = useState(false);

    const handlePaymentSuccess = (paymentData) => {
        const { business } = paymentData;
        console.log("Payment successful, data:", paymentData);

        if (fromBusinessDetail) {
            setBusiness({
                isAuthenticated: true,
                business,
            });
            console.log("Navigating to /businesses/", businessId);
            setSuccessModalVisible(true);
        } else {
            console.log("Navigating to /loginBusiness");
            setSuccessModalVisible(true);
        }
    };

    useEffect(() => {
        if (successModalVisible) {
            const timer = setTimeout(() => {
                setSuccessModalVisible(false);
                if (fromBusinessDetail) {
                    navigate(`/businesses/${businessId}`);
                } else {
                    navigate("/loginBusiness");
                }
            }, 5000);

            return () => clearTimeout(timer);
        }
    }, [successModalVisible, fromBusinessDetail, businessId, navigate]);


    const styles = `
    @keyframes pulse {
      0% { transform: translateX(-50%) scale(1); opacity: 1; }
      50% { transform: translateX(-50%) scale(1.2); opacity: 0.7; }
      100% { transform: translateX(-50%) scale(1); opacity: 1; }
    }

    @keyframes scaleIn {
      from { transform: scale(0); }
      to { transform: scale(1); }
    }

    @keyframes draw {
      from { stroke-dasharray: 0 50; }
      to { stroke-dasharray: 50 0; }
    }

    @keyframes fadeInUp {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }

    @keyframes progress {
      from { width: 100%; }
      to { width: 0%; }
    }
  `;

    return (
        <Row style={{ minHeight: "100vh", alignItems: "center", backgroundColor: "#f0f2f5" }}>

            <style dangerouslySetInnerHTML={{ __html: styles }} />

            <PaymentIllustration />
            <Elements stripe={stripePromise}>
                <PaymentForm
                    businessId={businessId}
                    amount={amount || 200000}
                    planType={planType || "hàng tháng"}
                    email={email}
                    businessName={businessName}
                    onPaymentSuccess={handlePaymentSuccess}
                    fromBusinessDetail={fromBusinessDetail}
                />
            </Elements>

            <Modal
                visible={successModalVisible}
                footer={null}
                closable={false}
                centered
                width={450}
                bodyStyle={{
                    padding: 0,
                    borderRadius: "12px",
                    overflow: "hidden",
                    background: "linear-gradient(135deg, #ffffff 0%, #f6f8ff 100%)",
                    boxShadow: "0 8px 32px rgba(31, 38, 135, 0.2)",
                }}
            >
                <div
                    style={{
                        padding: "40px 32px",
                        textAlign: "center",
                        position: "relative",
                    }}
                >
                    <div
                        style={{
                            position: "absolute",
                            top: "-50px",
                            left: "50%",
                            transform: "translateX(-50%)",
                            width: "150px",
                            height: "150px",
                            background: "rgba(82, 196, 26, 0.1)",
                            borderRadius: "50%",
                            zIndex: 0,
                            animation: "pulse 2s infinite",
                        }}
                    />

                    <div
                        style={{
                            position: "relative",
                            zIndex: 1,
                            marginBottom: "24px",
                        }}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 52 52"
                            style={{
                                width: "80px",
                                height: "80px",
                                animation: "scaleIn 0.3s ease-out",
                            }}
                        >
                            <circle
                                cx="26"
                                cy="26"
                                r="25"
                                fill="rgba(82, 196, 26, 0.1)"
                                stroke="#52c41a"
                                strokeWidth="2"
                            />
                            <path
                                fill="none"
                                stroke="#52c41a"
                                strokeWidth="4"
                                d="M14.1 27.2l7.1 7.2 16.7-16.8"
                                style={{ animation: "draw 0.5s ease-out" }}
                            />
                        </svg>
                    </div>

                    <Title
                        level={3}
                        style={{
                            margin: "0 0 16px",
                            color: "#1a1a1a",
                            fontWeight: 600,
                            animation: "fadeInUp 0.5s ease-out",
                        }}
                    >
                        Thanh toán thành công!
                    </Title>

                    <div
                        style={{
                            background: "rgba(255, 255, 255, 0.9)",
                            borderRadius: "8px",
                            padding: "16px",
                            marginBottom: "24px",
                            animation: "fadeInUp 0.6s ease-out",
                        }}
                    >
                        <Text
                            style={{
                                display: "block",
                                marginBottom: "8px",
                                color: "#555",
                                fontSize: "16px",
                            }}
                        >
                            Số tiền: <strong style={{ color: "#52c41a" }}>{(amount || 200000).toLocaleString()} VND</strong>
                        </Text>
                        <Text
                            style={{
                                display: "block",
                                marginBottom: "8px",
                                color: "#555",
                                fontSize: "16px",
                            }}
                        >
                            Gói: <strong style={{ color: "#1890ff" }}>{planType || "hàng tháng"}</strong>
                        </Text>
                    </div>

                    <Text
                        style={{
                            display: "block",
                            color: "#666",
                            fontSize: "14px",
                            animation: "fadeInUp 0.7s ease-out",
                        }}
                    >
                        Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi!
                    </Text>

                    <div
                        style={{
                            height: "4px",
                            background: "#e8e8e8",
                            marginTop: "24px",
                            borderRadius: "2px",
                            overflow: "hidden",
                        }}
                    >
                        <div
                            style={{
                                height: "100%",
                                width: "100%",
                                background: "#52c41a",
                                animation: "progress 5s linear forwards",
                            }}
                        />
                    </div>
                </div>
            </Modal>
        </Row>
    );
};

export default PaymentPage;