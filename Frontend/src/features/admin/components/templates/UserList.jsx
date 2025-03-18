import React, { useState, useRef } from "react";
import { Table, Button, Tag, Modal, Form, Input, message, Select, Space } from "antd";
import { DeleteOutlined, EditOutlined, FilterOutlined, SearchOutlined } from "@ant-design/icons";
import "../../../../styles/TableAdmin.css";
import dayjs from "dayjs";
import Highlighter from 'react-highlight-words';

const UserList = ({ users, onDeleteUser, updateUser }) => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [form] = Form.useForm();
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef(null);

    const userData = Array.isArray(users) ? users : [];
    const enrichedUserData = userData.map((user) => ({
        ...user,
        status: user.status || "ONLINE",
    }));

    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
    };

    const handleReset = (clearFilters) => {
        clearFilters();
        setSearchText('');
    };

    const getColumnSearchProps = (dataIndex) => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
            <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
                <Input
                    ref={searchInput}
                    placeholder={`Tìm kiếm ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
                    style={{ marginBottom: 8, display: 'block' }}
                />
                <Space>
                    <Button
                        type="primary"
                        onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
                        icon={<SearchOutlined />}
                        size="small"
                        style={{ width: 90 }}
                    >
                        Tìm
                    </Button>
                    <Button
                        onClick={() => clearFilters && handleReset(clearFilters)}
                        size="small"
                        style={{ width: 90 }}
                    >
                        Xóa
                    </Button>
                </Space>
            </div>
        ),
        filterIcon: () => (
            <SearchOutlined style={{ color: 'white' }} />
        ),
        onFilter: (value, record) =>
            record[dataIndex]?.toString().toLowerCase().includes(value.toLowerCase()) || false,
        onFilterDropdownOpenChange: (visible) => {
            if (visible) {
                setTimeout(() => searchInput.current?.select(), 100);
            }
        },
        render: (text, record) => {
            if (dataIndex === 'name') {
                text = record.name;
            }
            return searchedColumn === dataIndex ? (
                <Highlighter
                    highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
                    searchWords={[searchText]}
                    autoEscape
                    textToHighlight={text ? text.toString() : ''}
                />
            ) : (
                text
            );
        },
    });

    const columns = [
        {
            title: "Họ và Tên",
            dataIndex: "name",
            key: "name",
            ...getColumnSearchProps('name'),
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
                        {searchedColumn === 'name' ? (
                            <Highlighter
                                highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
                                searchWords={[searchText]}
                                autoEscape
                                textToHighlight={text ? text.toString() : ''}
                            />
                        ) : (
                            text
                        )}
                        <br />
                        <small>{record.email}</small>
                    </span>
                </div>
            ),
        },
        {
            title: "Vai Trò",
            dataIndex: "role",
            key: "role",
            filters: [
                { text: "admin", value: "admin" },
                { text: "user", value: "user" },

            ],
            onFilter: (value, record) => record.role === value,
            filterMultiple: false,
            filterIcon: (filtered) => (
                <FilterOutlined style={{ color: 'white' }} />
            ),
        },
        {
            title: "Trạng Thái",
            dataIndex: "status",
            key: "status",
            filters: [
                { text: "ONLINE", value: "ONLINE" },
                { text: "OFFLINE", value: "OFFLINE" },
            ],
            onFilter: (value, record) => record.status === value,
            filterMultiple: false,
            filterIcon: (filtered) => (
                <FilterOutlined style={{ color: 'white' }} /> // Icon bộ lọc màu trắng
            ),
            render: (status) => (
                <Tag color={status === "ONLINE" ? "green" : "gray"}>{status}</Tag>
            ),
        },
        {
            title: "Ngày Tham Gia",
            dataIndex: "createdAt",
            key: "createdAt",
            ...getColumnSearchProps('createdAt'),
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
                        Sửa
                    </Button>
                    <Button
                        icon={<DeleteOutlined />}
                        danger
                        onClick={() => handleDelete(record._id)}
                    >
                        Xóa
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