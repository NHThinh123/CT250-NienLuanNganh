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

const { Header, Content } = Layout;

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

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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
    if (isAdminRoute) {
      setSidebarVisible(!sidebarVisible); // Luôn toggle sidebar trong admin route
    } else if (windowWidth <= 768) {
      setNavVisible(!navVisible); // Toggle NavBar trên mobile ngoài admin route
    }
  };

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
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
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
          <div style={{ flexShrink: 0, display: "flex", alignItems: "center" }}>
            {/* Luôn hiển thị nút hamburger trong admin route */}
            {(isAdminRoute || windowWidth <= 768) && (
              <Button
                style={{
                  fontSize: windowWidth <= 576 ? "16px" : "20px",
                  marginRight: 10,
                  border: "none",
                  padding: 0,
                  height: "auto",
                }}
                onClick={handleHamburgerClick}
              >
                ☰
              </Button>
            )}
            <img
              src={logo}
              style={{
                height: windowWidth <= 576 ? "40px" : "60px",
                width: "auto",
                marginTop: windowWidth <= 576 ? "5px" : "10px",
                marginBottom: windowWidth <= 576 ? "5px" : "10px",
              }}
              alt="logo"
            />
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
                        fontSize: windowWidth <= 768 ? "12px" : "14px",
                      }}
                    >
                      {displayName}
                    </span>
                    <Avatar
                      size={windowWidth <= 576 ? "small" : "default"}
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

      {isAdminRoute && (
        <Drawer
          title="Admin Menu"
          placement="left"
          onClose={() => setSidebarVisible(false)}
          open={sidebarVisible}
          width={windowWidth <= 576 ? "80vw" : "300px"}
        >
          <Sidebar />
        </Drawer>
      )}

      <Layout
        style={{ marginLeft: 0, minHeight: "100vh", overflowX: "hidden" }}
      >
        <Content
          style={{
            paddingTop: "68px",
            padding: windowWidth <= 768 ? "0 10px" : "0 20px",
            maxWidth: "100vw",
            overflowX: "hidden",
            boxSizing: "border-box",
          }}
        >
          <ScrollToTop />
          <ScrollToTopButton />
          <Outlet />
        </Content>
        {!isAdminRoute && <Footer />}
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
