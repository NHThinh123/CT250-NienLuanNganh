import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { Layout, Button, Space, Avatar, Dropdown, Spin, message } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { useContext, useState } from "react";
import { AuthContext } from "./contexts/auth.context";
import { BusinessContext } from "./contexts/business.context";
import NavBar from "./components/templates/NavBar";
import logo from "../src/assets/logo/logo.png";
import Footer from "./components/templates/Footer";
import ScrollToTop from "./components/atoms/ScrollToTop";
import ScrollToTopButton from "./components/atoms/ScrollToTopButton";
import Sidebar from "./components/templates/SideBar"; // Đảm bảo import đúng
import "antd/dist/reset.css";

const { Header, Content, Sider } = Layout;

function App() {
  const navigate = useNavigate();
  const location = useLocation();
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
      onClick: () => {
        if (isUserLoggedIn) {
          navigate("/profile");
        } else if (isBusinessLoggedIn) {
          const businessId =
            business?.business?.id ||
            JSON.parse(localStorage.getItem("authBusiness"))?.business?.id;
          if (businessId) {
            navigate(`/businesses/${businessId}`);
          } else {
            message.error(
              "Không tìm thấy thông tin doanh nghiệp. Vui lòng đăng nhập lại!"
            );
            console.error("Không tìm thấy ID doanh nghiệp");
          }
        }
      },
    },
    {
      key: "logout",
      label: "Đăng xuất",
      onClick: handleLogout,
    },
  ];

  const isAdminPage = location.pathname === "/admin";
  const isAdminTablePage = location.pathname === "/admintable";
  const isAdminAddPage = location.pathname === "/adminadd";
  const isAdminBillingPage = location.pathname === "/adminbilling";

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

          width: "100%",
          zIndex: 1000,
          backgroundColor: "#fff",
          padding: "0 20px",
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
          height: "64px",
          lineHeight: "64px",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            height: "100%",
          }}
        >
          {/* Logo */}
          <div style={{ flexShrink: 0, marginTop: "10px" }}>
            <img
              src={logo}
              style={{ height: "60px", width: "auto", marginBottom: "10px" }}
              alt="logo"
            />
          </div>

          {/* NavBar */}
          {!isAdminPage && !isAdminTablePage && !isAdminAddPage && !isAdminBillingPage && (
            <div style={{ flexGrow: 1, padding: "0 20px" }}>
              <NavBar />
            </div>
          )}
          {/* Đăng nhập/Đăng ký hoặc Avatar */}
          <div style={{ flexShrink: 0 }}>
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
        </div>
      </Header>

      {(isAdminPage || isAdminTablePage || isAdminAddPage || isAdminBillingPage) && (
        <Sider
          width={150}
          style={{
            position: "fixed",
            top: 64,
            left: 0,
            height: "calc(100vh - 64px)",
            background: "#fff",
            zIndex: 1000,
            overflow: "auto",
          }}
        >
          <Sidebar />
        </Sider>
      )}

      {/* Nội dung chính */}
      <Layout style={{ marginLeft: (isAdminPage || isAdminTablePage || isAdminAddPage || isAdminBillingPage) ? 150 : 0, minHeight: "100vh" }}>
        <Content style={{ paddingTop: "64px" }}>
          <ScrollToTop />
          <ScrollToTopButton />
          <Outlet />
        </Content>
        {!isAdminPage && !isAdminTablePage && !isAdminAddPage && !isAdminBillingPage && (
          <Footer />
        )}
      </Layout>
    </Layout>
  );
}

export default App;