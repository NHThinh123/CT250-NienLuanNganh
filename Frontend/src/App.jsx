import { Outlet, useNavigate } from "react-router-dom";
import { Layout, Button, Space, Avatar, Dropdown, Spin } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { useContext, useState } from "react";
import { AuthContext } from "./contexts/auth.context";
import { BusinessContext } from "./contexts/business.context";
import NavBar from "./components/templates/NavBar";
import logo from "../src/assets/logo/logo.png";
import Footer from "./components/templates/Footer";
import ScrollToTop from "./components/atoms/ScrollToTop";

const { Header, Content } = Layout;

function App() {
  const navigate = useNavigate();
  const { auth, setAuth } = useContext(AuthContext);
  const { business, setBusiness } = useContext(BusinessContext);

  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const isUserLoggedIn = auth?.isAuthenticated;
  const isBusinessLoggedIn = business?.isAuthenticated;

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

  const handleLogout = () => {
    setIsLoggingOut(true);
    setTimeout(() => {
      if (isUserLoggedIn) {
        setAuth({ isAuthenticated: false, user: {} });
        localStorage.removeItem("authUser");
      }
      if (isBusinessLoggedIn) {
        setBusiness({ isAuthenticated: false, business: {} });
        localStorage.removeItem("authBusiness");
      }
      setIsLoggingOut(false);
      navigate("/");
    }, 2000);
  };

  const menuItems = [
    {
      key: "profile",
      label: isUserLoggedIn ? "Hồ sơ cá nhân" : "Hồ sơ doanh nghiệp",
      onClick: () =>
        navigate(isUserLoggedIn ? "/profile" : "/business-profile"),
    },
    {
      key: "logout",
      label: "Đăng xuất",
      onClick: handleLogout,
    },
  ];

  return (
    <Layout style={{ margin: 0, position: "relative" }}>
      {isLoggingOut && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(255, 255, 255, 0.8)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999,
          }}
        >
          <Spin size="large" tip="Đang đăng xuất..." />
        </div>
      )}

      {/* Header cố định */}
      <Header
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          zIndex: 1000,
          backgroundColor: "#fff",
          padding: "0 20px",
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
          height: "64px", // Chiều cao cố định
          lineHeight: "64px", // Căn giữa theo chiều dọc
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            height: "100%", // Đảm bảo chiếm toàn bộ chiều cao của header
          }}
        >
          {/* Logo */}
          <div style={{ flexShrink: 0, marginTop: "16px" }}>
            <img
              src={logo}
              style={{ height: "60px", width: "auto" }} // Điều chỉnh kích thước logo
              alt="logo"
            />
          </div>

          {/* NavBar */}
          <div style={{ flexGrow: 1, padding: 20 }}>
            <NavBar />
          </div>

          {/* Đăng nhập/Đăng ký hoặc Avatar */}
          <div style={{ flexShrink: 0 }}>
            <Space>
              {isUserLoggedIn || isBusinessLoggedIn ? (
                <Dropdown
                  menu={{ items: menuItems }}
                  placement="bottomRight"
                  arrow
                >
                  <Space style={{ cursor: "pointer" }}>
                    <Avatar
                      src={avatarSrc}
                      icon={!avatarSrc && <UserOutlined />}
                    />
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
        </div>
      </Header>

      {/* Nội dung chính */}
      <Content style={{ paddingTop: "64px" }}>
        {" "}
        {/* Padding dựa trên chiều cao header */}
        <ScrollToTop />
        <Outlet />
      </Content>

      <Footer />
    </Layout>
  );
}

export default App;
