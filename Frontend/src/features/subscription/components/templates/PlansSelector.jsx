import React from "react";
import { Row, Col, Button } from "antd";
import SubscriptionPlanCard from "./SubscriptionPlanCard";

const PlansSelector = ({ selectedPlan, onPlanChange, onUpgrade }) => {
    return (
        <div>
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
                        saveAmount="Tiết kiệm $20"
                        isSelected={selectedPlan === "yearly"}
                        onSelect={() => onPlanChange("yearly")}
                    />
                </Col>
            </Row>
            <Button
                type="primary"
                block
                style={{ backgroundColor: "#52c41a", borderColor: "#52c41a" }}
                onClick={onUpgrade}
            >
                Kích hoạt ngay
            </Button>
        </div>
    );
};

export default PlansSelector;