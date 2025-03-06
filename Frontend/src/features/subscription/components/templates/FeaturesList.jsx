import React from "react";
import { Divider } from "antd";

const FeaturesList = () => {
    return (
        <div>
            <Divider orientation="left" orientationMargin="0">
                <span style={{ color: "#52c41a" }}>Tính năng bao gồm</span>
            </Divider>
            <ul style={{ paddingLeft: "20px", marginBottom: "20px" }}>
                <li>Không giới hạn tin nhắn chat để hỏi về dự án, viết bài kiểm tra, cải thiện mã, và hơn thế nữa</li>
                <li>Truy cập các mô hình nâng cao như OpenAI 1.0 và Gemini 2.0 Flash</li>
                <li>Không giới hạn tự động hoàn thành mã trong trình soạn thảo</li>
                <li>Truy cập không giới hạn vào Workspace</li>
            </ul>
        </div>
    );
};

export default FeaturesList;