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

function App() {
  const navigate = useNavigate();
  const { auth, setAuth } = useContext(AuthContext);
  const { business, setBusiness } = useContext(BusinessContext);
  console.log("Auth trong App:", auth);
  console.log("Business trong App:", business);

  const [isLoggingOut, setIsLoggingOut] = useState(false); // Trạng thái loading

  const isUserLoggedIn = auth?.isAuthenticated;
  const isBusinessLoggedIn = business?.isAuthenticated;

  const avatarSrc = isUserLoggedIn
    ? auth.user?.avatar
    : isBusinessLoggedIn
      ? business.business.avatar
      : null;

  const displayName = isUserLoggedIn
    ? auth.user?.name
    : isBusinessLoggedIn
      ? business.business.business_name
      : "";

  const handleLogout = () => {
    setIsLoggingOut(true); // Bật trạng thái loading

    setTimeout(() => {
      if (isUserLoggedIn) {
        setAuth({ isAuthenticated: false, user: {} });
        localStorage.removeItem("authUser");
      }
      if (isBusinessLoggedIn) {
        setBusiness({ isAuthenticated: false, business: {} });
        localStorage.removeItem("authBusiness");
      }

      setIsLoggingOut(false); // Tắt trạng thái loading
      navigate("/");
    }, 2000); // Giả lập loading 2 giây (có thể thay bằng API call)
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
