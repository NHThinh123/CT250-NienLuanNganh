import React, { useState } from "react";
import { Row, Col, Button, Spin } from "antd";
import SubscriptionPlanCard from "./SubscriptionPlanCard";

const PlansSelector = ({ selectedPlan, onPlanChange, onUpgrade }) => {
    const [loading, setLoading] = useState(false);

    const handleUpgrade = async () => {
        setLoading(true);

        setTimeout(async () => {
            await onUpgrade();
            setLoading(false);
        }, 2000);
    };

    return (
        <div style={{ position: "relative" }}>
            {loading && (
                <div
                    style={{
                        position: "fixed",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        backgroundColor: "rgba(0, 0, 0, 0.5)",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        zIndex: 9999,
                    }}
                >
                    <Spin size="large" />
                </div>
            )}

            <Row gutter={[16, 16]} style={{ marginBottom: "20px" }}>
                <Col xs={24} sm={12}>
                    <SubscriptionPlanCard
                        title="Gói tháng"
                        price="200.000"
                        period="vnd/tháng"
                        isSelected={selectedPlan === "monthly"}
                        onSelect={() => onPlanChange("monthly")}
                    />
                </Col>
                <Col xs={24} sm={12}>
                    <SubscriptionPlanCard
                        title="Gói năm"
                        price="2.000.000"
                        period="vnd/năm"
                        saveAmount="Tiết kiệm 400.000 vnd"
                        isSelected={selectedPlan === "yearly"}
                        onSelect={() => onPlanChange("yearly")}
                    />
                </Col>
            </Row>

            <Button
                type="primary"
                block
                style={{ backgroundColor: "#52c41a", borderColor: "#52c41a" }}
                onClick={handleUpgrade}
                disabled={loading}
            >
                {loading ? "Đang xử lý..." : "Chọn gói cước"}
            </Button>
        </div>
    );
};

export default PlansSelector;
