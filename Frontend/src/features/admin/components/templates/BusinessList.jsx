import React, { useState } from "react";
import { Table, Button, Tag, Modal, Form, Input, message, Select } from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import "../../../../styles/TableAdmin.css";
import dayjs from "dayjs";

const BusinessList = ({ businesses, onDeleteBusiness, updateBusiness }) => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedBusiness, setSelectedBusiness] = useState(null);
    const [form] = Form.useForm();

    const businessData = Array.isArray(businesses) ? businesses : [];

    const enrichedBusinessData = businessData.map((business) => ({
        ...business,
        status: business.status || "ONLINE",
        openingDate: business.openingDate || "N/A",
    }));

    const columns = [
        {
            title: "Tên Doanh Nghiệp",
            dataIndex: "business_name",
            key: "business_name",
            render: (text, record) => (
                <div style={{ display: "flex", alignItems: "center" }}>
                    <img
                        src={
                            record.avatar ||
                            "https://inkythuatso.com/uploads/thumbnails/800/2023/03/9-anh-dai-dien-trang-inkythuatso-03-15-27-03.jpg"
                        }
                        alt={text}
                        style={{ width: 40, height: 40, borderRadius: "50%", marginRight: 10 }}
                    />
                    <span>
                        {text} <br /> <small>{record.email}</small>
                    </span>
                </div>
            ),
        },
        { title: "Địa chỉ", dataIndex: "location", key: "location" },
        {
            title: "Trạng Thái",
            dataIndex: "status",
            key: "status",
            render: (status) => (
                <Tag color={status === "active" ? "green" : status === "pending" ? "gray" : "yellow"}>{status}</Tag>
            ),
        },
        {
            title: "Ngày Thanh Toán",
            dataIndex: "lastPaymentDate",
            key: "lastPaymentDate",
            render: (date) => (date ? dayjs(date).format("YYYY-MM-DD") : "N/A"),
        },
        {
            title: "",
            key: "action",
            render: (_, record) => (
                <>
                    <Button
                        icon={<EditOutlined />}
                        style={{ marginRight: 8 }}
                        onClick={() => handleEdit(record)}
                    >
                        Edit
                    </Button>
                    <Button
                        icon={<DeleteOutlined />}
                        danger
                        onClick={() => handleDelete(record._id)}
                    >
                        Delete
                    </Button>
                </>
            ),
        },
    ];

    const handleEdit = (business) => {
        setSelectedBusiness(business);
        form.setFieldsValue({
            business_name: business.business_name,
            email: business.email,
            location: business.location,
            status: business.status,
        });
        setIsModalVisible(true);
    };

    const handleDelete = (businessId) => {
        Modal.confirm({
            title: "Bạn có chắc muốn xóa doanh nghiệp này?",
            content: "Hành động này không thể khôi phục!",
            okText: "Xóa",
            okType: "danger",
            cancelText: "Hủy",
            onOk() {
                if (onDeleteBusiness) {
                    onDeleteBusiness(businessId);
                }
            },
        });
    };

    const handleUpdate = async (values) => {
        if (selectedBusiness && updateBusiness) {
            try {
                await updateBusiness({ id: selectedBusiness._id, data: values });
                message.success("Cập nhật doanh nghiệp thành công!");
                setIsModalVisible(false);
                form.resetFields();
            } catch (error) {
                console.error("Lỗi cập nhật doanh nghiệp:", error);
                message.error("Cập nhật doanh nghiệp thất bại: " + (error.message || "Không rõ lỗi"));
            }
        }
    };

    const handleCancel = () => {
        setIsModalVisible(false);
        form.resetFields();
    };

    return (
        <>
            <Table
                dataSource={enrichedBusinessData}
                columns={columns}
                rowKey="_id"
                className="custom-table"
                scroll={{ x: 800 }}
                pagination={{ pageSize: 5, position: ["bottomCenter"] }}
            />
            <Modal
                title="Chỉnh sửa thông tin doanh nghiệp"
                visible={isModalVisible}
                onOk={() => form.submit()}
                onCancel={handleCancel}
                okText="Lưu"
                cancelText="Hủy"
            >
                <Form
                    form={form}
                    name="businessForm"
                    onFinish={handleUpdate}
                    layout="vertical"
                >
                    <Form.Item
                        name="business_name"
                        label="Tên Doanh Nghiệp"
                        rules={[{ required: true, message: "Vui lòng nhập tên doanh nghiệp!" }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="email"
                        label="Email"
                        rules={[
                            { required: true, message: "Vui lòng nhập email!" },
                            { type: "email", message: "Email không hợp lệ!" },
                        ]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="location"
                        label="Địa chỉ"
                        rules={[{ required: true, message: "Vui lòng nhập địa chỉ!" }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="status"
                        label="Trạng Thái"
                        rules={[{ required: true, message: "Vui lòng chọn trạng thái!" }]}
                    >
                        <Select>
                            <Select.Option value="active">active</Select.Option>
                            <Select.Option value="pending">pending</Select.Option>
                            <Select.Option value="suspended">suspended</Select.Option>
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
};

export default BusinessList;