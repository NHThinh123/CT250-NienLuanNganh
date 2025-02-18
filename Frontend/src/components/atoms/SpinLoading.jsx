import { Spin } from "antd";
import { CenterOutlined } from "@ant-design/icons";

const SpinLoading = ({ spinning }) => {
  return (
    <div
      style={{
        display: spinning ? "flex" : "none",
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0, 0, 0, 0.5)", // Màu mờ
        justifyContent: "center",
        alignItems: "center",
        zIndex: 9999, // Đảm bảo lớp phủ ở trên cùng
      }}
    >
      <Spin size="large" indicator={<CenterOutlined />} />
    </div>
  );
};

export default SpinLoading;
