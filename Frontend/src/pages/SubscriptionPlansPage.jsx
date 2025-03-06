import React, { useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { Row, Col, Typography } from "antd";
import FeaturesList from "../features/subscription/components/templates/FeaturesList";
import BillingInfo from "../features/subscription/components/templates/BillingInfo";
import PlansSelector from "../features/subscription/components/templates/PlansSelector";

const { Title } = Typography;

const SubscriptionPlansPage = () => {
    const { businessId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const [selectedPlan, setSelectedPlan] = useState("monthly");

    // Lấy email và businessName từ state
    const { email, businessName } = location.state || {};

    const handlePlanChange = (plan) => {
        setSelectedPlan(plan);
    };

    const handleUpgrade = () => {
        const amount = selectedPlan === "monthly" ? 50.00 : 500.00;
        // Truyền email, businessName và amount qua state
        navigate(`/payment/activation/${businessId}`, {
            state: { amount, email, businessName },
        });
    };

    return (
        <Row
            justify="center"
            align="middle"
            style={{ minHeight: "100vh", backgroundColor: "#f0f2f5", padding: "50px" }}
        >
            <Col xs={24} sm={20} md={16} lg={12}>
                <div
                    style={{
                        padding: "30px",
                        background: "#fff",
                        borderRadius: "8px",
                        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
                    }}
                >
                    <Title level={2} style={{ textAlign: "center" }}>
                        Kích hoạt tài khoản của bạn
                    </Title>
                    <FeaturesList />
                    <BillingInfo />
                    <PlansSelector
                        selectedPlan={selectedPlan}
                        onPlanChange={handlePlanChange}
                        onUpgrade={handleUpgrade}
                    />
                </div>
            </Col>
        </Row>
    );
};

export default SubscriptionPlansPage;
