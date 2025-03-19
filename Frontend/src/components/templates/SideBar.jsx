import React from "react";
import { Layout, Menu } from "antd";
import { List, Receipt, SquarePlus } from "lucide-react";
import {
    DashboardOutlined,
} from "@ant-design/icons";
import { useLocation, useNavigate } from "react-router-dom";

const { Sider } = Layout;
const { SubMenu } = Menu;

const Sidebar = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const menuItems = [
        {
            key: "/admin",
            icon: <DashboardOutlined />,
            label: "Trang Chủ",
            onClick: () => navigate("/admin"),
        },
        {
            key: "/admintable",
            icon: <List size={16} />,
            label: "Danh Sách",
            onClick: () => navigate("/admintable"),
        },
        {
            key: "/adminadd",
            icon: <SquarePlus size={16} />,
            label: "Thêm mới",
            onClick: () => navigate("/adminadd"),
        },
        {
            key: "/adminbilling",
            icon: <Receipt size={16} />,
            label: "Hóa Đơn",
            onClick: () => navigate("/adminbilling"),
        },

    ];

    return (
        <Sider width={150} style={{ background: "#fff", height: "100vh", position: "fixed" }}>

            <Menu
                mode="inline"
                defaultSelectedKeys={[location.pathname]}
                style={{ height: "100%", borderRight: 0 }}
            >
                {menuItems.map((item) => (
                    <Menu.Item
                        key={item.key}
                        icon={item.icon}
                        onClick={item.onClick}
                        style={{ margin: "0" }}
                    >
                        {item.label}
                    </Menu.Item>
                ))}
            </Menu>
        </Sider>
    );
};

export default Sidebar;