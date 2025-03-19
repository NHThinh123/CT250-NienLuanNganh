import React from "react";
import { Table, Card, Spin, Alert } from "antd";

const BillingTable = ({ invoices, isInvoicesLoading, invoicesError }) => {
    const columns = [
        {
            title: "Mã thanh toán",
            dataIndex: "paymentId",
            key: "paymentId",
        },
        {
            title: "Tên doanh nghiệp",
            dataIndex: "businessName",
            key: "businessName",
        },
        {
            title: "Số tiền (VND)",
            dataIndex: "amount",
            key: "amount",
            render: (amount) => `${amount.toLocaleString()} VND`,
        },
        {
            title: "Khách hàng",
            dataIndex: "customerId",
            key: "customerId",
        },
        {
            title: "Email khách hàng",
            dataIndex: "customerEmail",
            key: "customerEmail",
        },
        {
            title: "Ngày thanh toán",
            dataIndex: "paymentDate",
            key: "paymentDate",
            render: (date) => new Date(date).toLocaleDateString("vi-VN"),
        },
        {
            title: "Hành động",
            key: "action",
            render: (record) => (
                <a href={record.invoicePdf} target="_blank" rel="noopener noreferrer">
                    Xem hóa đơn
                </a>
            ),
        },
    ];

    return (
        <Card title="Danh sách hóa đơn" style={{ marginTop: 16 }}>
            {isInvoicesLoading ? (
                <div style={{ textAlign: "center" }}>
                    <Spin tip="Đang tải hóa đơn..." />
                </div>
            ) : invoicesError ? (
                <Alert
                    message="Lỗi"
                    description="Không thể tải danh sách hóa đơn. Vui lòng thử lại sau."
                    type="error"
                    showIcon
                />
            ) : invoices.length === 0 ? (
                <Alert
                    message="Thông báo"
                    description="Chưa có hóa đơn nào."
                    type="info"
                    showIcon
                />
            ) : (
                <Table
                    columns={columns}
                    dataSource={invoices}
                    rowKey="paymentId"
                    pagination={{ pageSize: 10, position: ["bottomCenter"] }}
                />
            )}
        </Card>
    );
};

export default BillingTable;