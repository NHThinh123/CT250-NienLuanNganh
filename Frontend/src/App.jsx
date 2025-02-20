import { Outlet, useNavigate } from "react-router-dom";
import { Layout, Button, Space, Avatar, Dropdown, Menu } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { useContext } from "react";
import { AuthContext } from "./contexts/auth.context";
import { BusinessContext } from "./contexts/business.context";
import NavBar from "./components/templates/NavBar";
import logo from "../src/assets/logo/logo.png";
import Footer from "./components/templates/Footer";
import ScrollToTop from "./components/atoms/ScrollToTop";

function App() {
  const navigate = useNavigate();
  const { auth, setAuth } = useContext(AuthContext); // User Context
  const { business, setBusiness } = useContext(BusinessContext); // Business Context

  // Kiểm tra ai đang đăng nhập (User hay Business)
  const isUserLoggedIn = auth?.isAuthenticated;
  const isBusinessLoggedIn = business?.isAuthenticated;

  // Lấy thông tin avatar & tên theo loại tài khoản
  const avatarSrc = isUserLoggedIn
    ? auth.user?.avatar
    : isBusinessLoggedIn
      ? business.business?.avatar
      : null;

  const displayName = isUserLoggedIn
    ? auth.user?.name
    : isBusinessLoggedIn
      ? business.business?.business_name
      : "";

  // Xử lý đăng xuất
  const handleLogout = () => {
    if (isUserLoggedIn) {
      setAuth({ isAuthenticated: false, user: {} });
      localStorage.removeItem("authUser");
    }
    if (isBusinessLoggedIn) {
      setBusiness({ isAuthenticated: false, business: {} });
      localStorage.removeItem("authBusiness");
    }
    navigate("/");
  };

  // Menu dropdown cho User hoặc Business
  const menuItems = [
    {
      key: "profile",
      label: isUserLoggedIn ? "Hồ sơ cá nhân" : "Hồ sơ doanh nghiệp",
      onClick: () => navigate(isUserLoggedIn ? "/profile" : "/business-profile"),
    },
    {
      key: "logout",
      label: "Đăng xuất",
      onClick: handleLogout,
    },
  ];

  return (
    <Layout style={{ margin: 0 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "0 20px",
        }}
      >
        <img src={logo} style={{ width: "12vw", height: "12vh" }} alt="logo" />
        <Space>
          {isUserLoggedIn || isBusinessLoggedIn ? (
            <Dropdown menu={{ items: menuItems }} placement="bottomRight" arrow>
              <Space style={{ cursor: "pointer" }}>
                <Avatar src={avatarSrc} icon={!avatarSrc && <UserOutlined />} />
                <span>{displayName}</span>
              </Space>
            </Dropdown>

          ) : (
            <>
              <Button type="primary" onClick={() => navigate("/login")}>
                Đăng nhập
              </Button>
              <Button onClick={() => navigate("/signup")}>Đăng ký</Button>
            </>
          )}
        </Space>
      </div>
      <NavBar />
      <ScrollToTop />
      <Outlet />
      <Footer />
    </Layout>
  );
}

export default App;
