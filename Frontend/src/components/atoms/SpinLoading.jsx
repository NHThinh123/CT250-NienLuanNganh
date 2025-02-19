import { Spin } from "antd";

const SpinLoading = () => {
  return (
    <div
      style={{
        display: "flex",
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0, 0, 0, 0.2)", // Màu mờ
        justifyContent: "center",
        alignItems: "center",
        zIndex: 9999, // Đảm bảo lớp phủ ở trên cùng
      }}
    >
      <Spin size="large" />
    </div>
  );
};

export default SpinLoading;
