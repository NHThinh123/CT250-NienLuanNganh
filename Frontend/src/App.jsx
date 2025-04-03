import { Outlet, useNavigate, useLocation } from "react-router-dom";
import {
  Layout,
  Button,
  Space,
  Avatar,
  Dropdown,
  Spin,
  message,
  Badge,
  Drawer,
} from "antd";
import { UserOutlined } from "@ant-design/icons";
import { useContext, useState, useEffect } from "react";
import { AuthContext } from "./contexts/auth.context";
import { BusinessContext } from "./contexts/business.context";
import { ChatContext } from "./contexts/chat.context";
import NavBar from "./components/templates/NavBar";
import logo from "../src/assets/logo/logo.png";
import Footer from "./components/templates/Footer";
import ScrollToTop from "./components/atoms/ScrollToTop";
import ScrollToTopButton from "./components/atoms/ScrollToTopButton";
import Sidebar from "./components/templates/SideBar";
import ChatWindow from "./components/atoms/ChatWindow";
import BusinessList from "./features/chat/components/templates/BusinessList";
import UserList from "./features/chat/components/templates/UserList";
import "antd/dist/reset.css";
import { MessageCircleMore } from "lucide-react";

const { Header, Content, Sider } = Layout;

function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const { auth, setAuth } = useContext(AuthContext);
  const { business, setBusiness } = useContext(BusinessContext);
  const { chatSessions, addChatSession, removeChatSession } =
    useContext(ChatContext);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [showBusinessList, setShowBusinessList] = useState(false);
  const [showUserList, setShowUserList] = useState(false);
  const [unreadMessages, setUnreadMessages] = useState(() => {
    const saved = localStorage.getItem("unreadMessages");
    return saved ? JSON.parse(saved) : {};
  });
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [navVisible, setNavVisible] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Điểm breakpoint cho việc chuyển đổi giữa sidebar cố định và drawer
  const SIDEBAR_BREAKPOINT = 992; // Điểm breakpoint khi sidebar bắt đầu ẩn

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setWindowWidth(width);

      // Tự động đóng sidebar drawer khi màn hình rộng ra
      if (width > SIDEBAR_BREAKPOINT && sidebarVisible) {
        setSidebarVisible(false);
      }

      // Tự động đóng navbar drawer khi màn hình rộng ra
      if (width > 768 && navVisible) {
        setNavVisible(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [sidebarVisible, navVisible]);

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

  const userId = isUserLoggedIn ? auth.user?.id : null;
  const businessId = isBusinessLoggedIn ? business.business?.id : null;

  useEffect(() => {
    localStorage.setItem("unreadMessages", JSON.stringify(unreadMessages));
  }, [unreadMessages]);

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
  const isAdminRoute =
    isAdminPage || isAdminTablePage || isAdminAddPage || isAdminBillingPage;

  const handleOpenChat = () => {
    if (!userId && !businessId) {
      message.warning("Vui lòng đăng nhập để sử dụng chat!");
      return;
    }
    if (isUserLoggedIn) {
      setShowBusinessList(true);
    } else if (isBusinessLoggedIn) {
      setShowUserList(true);
    }
  };

  const handleSelectBusiness = ({ businessId, businessName, avatar }) => {
    if (userId) {
      if (
        !chatSessions.some(
          (session) =>
            session.userId === userId && session.businessId === businessId
        )
      ) {
        addChatSession(userId, businessId, businessName, avatar);
      }
      setShowBusinessList(false);
    } else {
      message.error("Không tìm thấy userId!");
    }
  };

  const handleSelectUser = ({ userId, userName, avatar }) => {
    if (businessId) {
      if (
        !chatSessions.some(
          (session) =>
            session.businessId === businessId && session.userId === userId
        )
      ) {
        addChatSession(userId, businessId, userName, avatar);
      }
      setShowUserList(false);
    } else {
      message.error("Không tìm thấy businessId!");
    }
  };

  const handleNewMessage = (newMessage, businessId, userId, name, avatar) => {
    if (isUserLoggedIn) {
      if (!chatSessions.some((session) => session.businessId === businessId)) {
        addChatSession(userId, businessId, name, avatar);
      }
    } else if (isBusinessLoggedIn) {
      if (!chatSessions.some((session) => session.userId === userId)) {
        addChatSession(userId, businessId, name, avatar);
      }
    }

    if (!newMessage || !newMessage.senderId || !newMessage.receiverId) {
      console.error("Invalid newMessage structure:", newMessage);
      return;
    }

    const senderId =
      typeof newMessage.senderId === "object" && newMessage.senderId?._id
        ? newMessage.senderId._id
        : newMessage.senderId;
    const receiverId =
      typeof newMessage.receiverId === "object" && newMessage.receiverId?._id
        ? newMessage.receiverId._id
        : newMessage.receiverId;

    if (!senderId || !receiverId) {
      console.error("Missing senderId or receiverId:", {
        senderId,
        receiverId,
      });
      return;
    }

    const targetId = isUserLoggedIn ? businessId : userId;
    if (
      !newMessage.isRead &&
      senderId !== (isUserLoggedIn ? userId : businessId)
    ) {
      setUnreadMessages((prev) => ({
        ...prev,
        [targetId]: (prev[targetId] || 0) + 1,
      }));
    }
  };

  const totalUnreadCount = Object.values(unreadMessages).reduce(
    (sum, count) => sum + count,
    0
  );

  const handleHamburgerClick = () => {
    if (windowWidth <= SIDEBAR_BREAKPOINT && isAdminRoute) {
      setSidebarVisible(true);
    } else if (!isAdminRoute) {
      setNavVisible(true);
    }
  };

  // Tính toán margin cho nội dung khi có sidebar
  const contentMarginLeft = isAdminRoute && windowWidth > SIDEBAR_BREAKPOINT
    ? (sidebarCollapsed ? 80 : 200)
    : 0;

  return (
    <Layout style={{ margin: 0, position: "relative", overflowX: "hidden" }}>
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

      <Header
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          maxWidth: "100vw",
          zIndex: 1000,
          backgroundColor: "#fff",
          padding: windowWidth <= 768 ? "0 10px" : "0 20px",
          //boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
          height: "64px",
          lineHeight: "64px",
          boxSizing: "border-box",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            height: "100%",
            maxWidth: "100%",
          }}
        >
          <div style={{ flexShrink: 0, marginTop: "10px" }}>
            {(windowWidth <= SIDEBAR_BREAKPOINT && isAdminRoute) || (windowWidth <= 768 && !isAdminRoute) ? (
              <Button
                style={{ fontSize: "20px" }}
                onClick={handleHamburgerClick}
              >
                ☰
              </Button>
            ) : (
              <img
                src={logo}
                style={{
                  height: "60px",
                  width: "auto",
                  marginBottom: "10px",
                }}
                alt="logo"
              />
            )}
          </div>

          {!isAdminRoute && windowWidth > 768 && (
            <div style={{ flexGrow: 1, padding: "0 20px", overflow: "hidden" }}>
              <NavBar />
            </div>
          )}

          <div style={{ flexShrink: 0 }}>
            <Space size={windowWidth <= 768 ? "small" : "middle"}>
              {isUserLoggedIn || isBusinessLoggedIn ? (
                <Dropdown
                  menu={{ items: menuItems }}
                  placement="bottomRight"
                  arrow
                >
                  <Space style={{ cursor: "pointer" }}>
                    <span
                      style={{
                        display: windowWidth <= 768 ? "none" : "inline",
                      }}
                    >
                      {displayName}
                    </span>
                    <Avatar
                      src={avatarSrc}
                      icon={!avatarSrc && <UserOutlined />}
                    />
                  </Space>
                </Dropdown>
              ) : (
                <>
                  <Button
                    type="primary"
                    size={windowWidth <= 768 ? "small" : "middle"}
                    onClick={() => navigate("/login")}
                  >
                    Đăng nhập
                  </Button>
                  <Button
                    size={windowWidth <= 768 ? "small" : "middle"}
                    onClick={() => navigate("/signup")}
                  >
                    Đăng ký
                  </Button>
                </>
              )}
            </Space>
          </div>
        </div>
      </Header>

      {!isAdminRoute && (
        <Drawer
          title={
            <img
              src={logo}
              alt="logo"
              style={{
                height: "40px",
                width: "auto",
              }}
            />
          }
          placement="left"
          onClose={() => setNavVisible(false)}
          open={navVisible}
          style={{ padding: 0 }}
          bodyStyle={{ padding: 0 }}
          width={windowWidth <= 576 ? "80vw" : "300px"}
        >
          <NavBar />
        </Drawer>
      )}

      <Layout style={{ minHeight: "100vh" }}>
        {/* Sidebar cố định cho Admin khi màn hình rộng */}
        {isAdminRoute && windowWidth > SIDEBAR_BREAKPOINT && (
          <Sider
            width={200}
            collapsible
            collapsed={sidebarCollapsed}
            onCollapse={(collapsed) => setSidebarCollapsed(collapsed)}
            style={{
              background: "#fff",
              overflow: 'auto',
              height: '100vh',
              position: 'fixed',
              left: 0,
              top: 64,
              zIndex: 999,
              boxShadow: '2px 0 8px rgba(0,0,0,0.05)',
            }}
          >
            <div style={{
              padding: '16px',
              textAlign: 'center',
              display: sidebarCollapsed ? 'none' : 'block'
            }}>
              {/* <img
                src={logo}
                alt="Admin Logo"
                style={{
                  width: '80%',
                  marginBottom: '20px'
                }}
              /> */}
            </div>
            <Sidebar collapsed={sidebarCollapsed} />
          </Sider>
        )}

        {/* Drawer Sidebar cho Admin khi màn hình nhỏ */}
        {isAdminRoute && (
          <Drawer

            placement="left"
            onClose={() => setSidebarVisible(false)}
            open={sidebarVisible}
            width={windowWidth <= 576 ? "80vw" : "300px"}
          >
            <Sidebar />
          </Drawer>
        )}

        <Layout style={{ marginLeft: contentMarginLeft, transition: 'margin 0.2s' }}>
          <Content
            style={{
              paddingTop: "68px",
              padding: windowWidth <= 768 ? "68px 10px 10px" : "68px 20px 20px",
              maxWidth: "100vw",
              overflowX: "hidden",
              boxSizing: "border-box",
              minHeight: "100vh",
            }}
          >
            <ScrollToTop />
            <ScrollToTopButton />
            <Outlet />
          </Content>
          {!isAdminRoute && <Footer />}
        </Layout>
      </Layout>

      {(isUserLoggedIn || isBusinessLoggedIn) && !isAdminRoute && (
        <>
          <Button
            type="primary"
            shape="circle"
            icon={
              <Badge
                count={totalUnreadCount}
                offset={[-5, 5]}
                style={{
                  backgroundColor: "#f5222d",
                  boxShadow: "0 0 0 2px white",
                  fontSize: "12px",
                  lineHeight: "16px",
                  height: "16px",
                  minWidth: "16px",
                }}
              >
                <MessageCircleMore color="#ffffff" />
              </Badge>
            }
            size={windowWidth <= 768 ? "middle" : "large"}
            style={{
              position: "fixed",
              bottom: 10,
              right: windowWidth <= 768 ? 20 : 70,
              zIndex: 1000,
              backgroundColor: "#52c41a",
              borderColor: "#52c41a",
              width: windowWidth <= 768 ? 50 : 60,
              height: windowWidth <= 768 ? 50 : 60,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            onClick={handleOpenChat}
          />
          {showBusinessList && (
            <BusinessList
              userId={userId}
              onSelectBusiness={handleSelectBusiness}
              onClose={() => setShowBusinessList(false)}
            />
          )}
          {showUserList && (
            <UserList
              businessId={businessId}
              onSelectUser={handleSelectUser}
              onClose={() => setShowUserList(false)}
            />
          )}
          {chatSessions.length > 0 &&
            chatSessions.map((session, index) => (
              <ChatWindow
                key={`${session.userId}-${session.businessId}`}
                userId={session.userId}
                businessId={session.businessId}
                businessName={session.businessName}
                userName={session.userName}
                avatar={session.avatar}
                onClose={() =>
                  removeChatSession(session.userId, session.businessId)
                }
                onNewMessage={(newMessage) =>
                  handleNewMessage(
                    newMessage,
                    session.businessId,
                    session.userId,
                    session.businessName || session.userName,
                    session.avatar
                  )
                }
                style={{
                  bottom:
                    windowWidth <= 768 ? 60 + index * 40 : 80 + index * 50,
                  right: windowWidth <= 768 ? 10 : 20,
                  width: windowWidth <= 768 ? "85vw" : "400px",
                  maxWidth: "100%",
                  boxSizing: "border-box",
                }}
              />
            ))}
        </>
      )}
    </Layout>
  );
}

export default App;