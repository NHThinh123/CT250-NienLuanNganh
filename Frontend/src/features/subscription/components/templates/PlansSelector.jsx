import React, { useState } from "react";
import { Row, Col, Button, Spin } from "antd";
import SubscriptionPlanCard from "./SubscriptionPlanCard";

const PlansSelector = ({ selectedPlan, onPlanChange, onUpgrade }) => {
    const [loading, setLoading] = useState(false);

    const handleUpgrade = async () => {
        setLoading(true);

        // Giả lập quá trình xử lý mất 2 giây trước khi hoàn thành
        setTimeout(async () => {
            await onUpgrade(); // Gọi hàm onUpgrade
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
                        price="$50"
                        period="USD/tháng"
                        isSelected={selectedPlan === "monthly"}
                        onSelect={() => onPlanChange("monthly")}
                    />
                </Col>
                <Col xs={24} sm={12}>
                    <SubscriptionPlanCard
                        title="Gói năm"
                        price="$500"
                        period="USD/năm"
                        saveAmount="Tiết kiệm $100"
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
                {loading ? "Đang xử lý..." : "Kích hoạt ngay"}
            </Button>
        </div>
    );
};

export default PlansSelector;
