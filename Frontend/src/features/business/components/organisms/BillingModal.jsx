// src/features/business/components/BillingModal.jsx
import { Modal, Card, Row, Col, Button, Typography, Space, Spin } from "antd";

const { Title, Text } = Typography;

const BillingModal = ({ open, onClose, billingData, isLoading }) => {
    const formatPrice = (price) => {
        if (typeof price !== "number" || isNaN(price)) {
            return "N/A";
        }
        return price.toLocaleString("vi-VN");
    };

    const formatDate = (date) => {
        if (!date) return "Chưa có thông tin";
        return new Date(date).toLocaleDateString("vi-VN", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        });
    };

    return (
        <Modal
            title={<Title level={4}>Danh sách hóa đơn đã thanh toán</Title>}
            open={open}
            onCancel={onClose}
            footer={<Button onClick={onClose}>Đóng</Button>}
            width={800}
        >
            {isLoading ? (
                <div style={{ textAlign: "center", padding: "20px" }}>
                    <Spin size="large" />
                </div>
            ) : billingData && billingData.length > 0 ? (
                <Space direction="vertical" style={{ width: "100%" }}>
                    {billingData.map((billing) => (
                        <Card
                            key={billing.paymentId}
                            style={{ marginBottom: "10px", borderRadius: "8px" }}
                        >
                            <Row gutter={[16, 16]}>
                                <Col span={12}>
                                    <Text strong>Mã hóa đơn: </Text>
                                    <Text>{billing.paymentId}</Text>
                                </Col>
                                <Col span={12}>
                                    <Text strong>Số tiền: </Text>
                                    <Text>{formatPrice(billing.amount)}đ</Text>
                                </Col>
                                <Col span={12}>
                                    <Text strong>Ngày thanh toán: </Text>
                                    <Text>{formatDate(billing.paymentDate)}</Text>
                                </Col>
                                <Col span={12}>
                                    <Text strong>Tên doanh nghiệp: </Text>
                                    <Text>{billing.businessName}</Text>
                                </Col>
                                <Col span={12}>
                                    {billing.invoicePdf && (
                                        <Button type="link" href={billing.invoicePdf} target="_blank">
                                            Tải hóa đơn (PDF)
                                        </Button>
                                    )}
                                </Col>
                                <Col span={12}>
                                    <Text strong>Trạng thái: </Text>
                                    <Text>{billing.status}</Text>
                                </Col>
                            </Row>
                        </Card>
                    ))}
                </Space>
            ) : (
                <Text>Chưa có hóa đơn nào.</Text>
            )}
        </Modal>
    );
};

export default BillingModal;