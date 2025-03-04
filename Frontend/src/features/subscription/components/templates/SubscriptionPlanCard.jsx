import React from "react";
import { Card, Radio } from "antd";

const SubscriptionPlanCard = ({ title, price, period, isSelected, onSelect, saveAmount }) => {
    return (
        <Card
            style={{
                width: "100%",
                border: isSelected ? "2px solid #1890ff" : "1px solid #e8e8e8",
                borderRadius: "8px",
                position: "relative",
            }}
        >
            {saveAmount && (
                <div
                    style={{
                        position: "absolute",
                        top: "10px",
                        right: "10px",
                        background: "#1890ff",
                        color: "#fff",
                        padding: "2px 8px",
                        borderRadius: "12px",
                        fontSize: "12px",
                    }}
                >
                    {saveAmount}
                </div>
            )}
            <Radio checked={isSelected} onChange={onSelect} style={{ marginBottom: "10px" }}>
                {title}
            </Radio>
            <div style={{ fontSize: "24px", fontWeight: "bold" }}>
                {price}
                <span style={{ fontSize: "14px", color: "#888" }}> {period}</span>
            </div>
        </Card>
    );
};

export default SubscriptionPlanCard;