import React, { useState } from "react";
import { Table, Button, Tag, Modal, Form, Input, message, Select } from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import "../../../../styles/TableAdmin.css";
import dayjs from "dayjs";

const UserList = ({ users, onDeleteUser, updateUser }) => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [form] = Form.useForm();

    const userData = Array.isArray(users) ? users : [];

    const enrichedUserData = userData.map((user) => ({
        ...user,
        status: user.status || "ONLINE",
    }));

    const columns = [
        {
            title: "Họ và Tên",
            dataIndex: "name",
            key: "name",
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
        { title: "Vai Trò", dataIndex: "role", key: "role" },
        {
            title: "Trạng Thái",
            dataIndex: "status",
            key: "status",
            render: (status) => (
                <Tag color={status === "ONLINE" ? "green" : "gray"}>{status}</Tag>
            ),
        },
        {
            title: "Ngày Tham Gia",
            dataIndex: "createdAt",
            key: "createdAt",
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

    const handleEdit = (user) => {
        setSelectedUser(user);
        form.setFieldsValue({
            name: user.name,
            email: user.email,
            role: user.role,
            status: user.status,
        });
        setIsModalVisible(true);
    };

    const handleDelete = (userId) => {
        Modal.confirm({
            title: "Bạn có chắc muốn xóa user này?",
            content: "Hành động này không thể khôi phục!",
            okText: "Xóa",
            okType: "danger",
            cancelText: "Hủy",
            onOk() {
                if (onDeleteUser) {
                    onDeleteUser(userId);
                }
            },
        });
    };

    const handleUpdate = async (values) => {
        if (selectedUser && updateUser) {
            try {
                await updateUser({ id: selectedUser._id, data: values });
                message.success("Cập nhật user thành công!");
                setIsModalVisible(false);
                form.resetFields();
            } catch (error) {
                console.error("Lỗi cập nhật user:", error);
                message.error("Cập nhật user thất bại: " + (error.message || "Không rõ lỗi"));
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
                dataSource={enrichedUserData}
                columns={columns}
                rowKey="_id"
                className="custom-table"
                scroll={{ x: 800 }}
                pagination={{ pageSize: 5, position: ["bottomCenter"] }}
            />
            <Modal
                title="Chỉnh sửa thông tin user"
                visible={isModalVisible}
                onOk={() => form.submit()}
                onCancel={handleCancel}
                okText="Lưu"
                cancelText="Hủy"
            >
                <Form
                    form={form}
                    name="userForm"
                    onFinish={handleUpdate}
                    layout="vertical"
                >
                    <Form.Item
                        name="name"
                        label="Họ và Tên"
                        rules={[{ required: true, message: "Vui lòng nhập họ và tên!" }]}
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
                        name="role"
                        label="Vai Trò"
                        rules={[{ required: true, message: "Vui lòng nhập vai trò!" }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="status"
                        label="Trạng Thái"
                        rules={[{ required: true, message: "Vui lòng chọn trạng thái!" }]}
                    >
                        <Select>
                            <Select.Option value="ONLINE">ONLINE</Select.Option>
                            <Select.Option value="OFFLINE">OFFLINE</Select.Option>
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
};

export default UserList;