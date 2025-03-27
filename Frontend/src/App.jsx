// App.jsx
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { Layout, Button, Space, Avatar, Dropdown, Spin, message, Badge } from "antd";
import { UserOutlined, MessageOutlined } from "@ant-design/icons";
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
  const { chatSessions, addChatSession, removeChatSession } = useContext(ChatContext);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [showBusinessList, setShowBusinessList] = useState(false);
  const [showUserList, setShowUserList] = useState(false);
  const [unreadMessages, setUnreadMessages] = useState(() => {
    const saved = localStorage.getItem("unreadMessages");
    return saved ? JSON.parse(saved) : {};
  });

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
  const isAdminRoute = isAdminPage || isAdminTablePage || isAdminAddPage || isAdminBillingPage;

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
      if (!chatSessions.some((session) => session.userId === userId && session.businessId === businessId)) {
        addChatSession(userId, businessId, businessName, avatar);
      }
      setShowBusinessList(false);
    } else {
      message.error("Không tìm thấy userId!");
    }
  };

  const handleSelectUser = ({ userId, userName, avatar }) => {
    if (businessId) {
      if (!chatSessions.some((session) => session.businessId === businessId && session.userId === userId)) {
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




    // Kiểm tra newMessage và các thuộc tính trước khi truy cập
    if (!newMessage || !newMessage.senderId || !newMessage.receiverId) {
      console.error("Invalid newMessage structure:", newMessage);
      return;
    }

    const senderId = typeof newMessage.senderId === "object" && newMessage.senderId?._id
      ? newMessage.senderId._id
      : newMessage.senderId;
    const receiverId = typeof newMessage.receiverId === "object" && newMessage.receiverId?._id
      ? newMessage.receiverId._id
      : newMessage.receiverId;

    // Kiểm tra senderId và receiverId
    if (!senderId || !receiverId) {
      console.error("Missing senderId or receiverId:", { senderId, receiverId });
      return;
    }

    const targetId = isUserLoggedIn ? businessId : userId;
    if (!newMessage.isRead && senderId !== (isUserLoggedIn ? userId : businessId)) {
      setUnreadMessages((prev) => {
        const newUnreadMessages = {
          ...prev,
          [targetId]: (prev[targetId] || 0) + 1,
        };
        console.log("Updated unreadMessages:", newUnreadMessages);
        return newUnreadMessages;
      });
    }
  };

  const totalUnreadCount = Object.values(unreadMessages).reduce((sum, count) => sum + count, 0);


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
          <div style={{ flexShrink: 0, marginTop: "10px" }}>
            <img
              src={logo}
              style={{ height: "60px", width: "auto", marginBottom: "10px" }}
              alt="logo"
            />
          </div>

          {!isAdminRoute && (
            <div style={{ flexGrow: 1, padding: "0 20px" }}>
              <NavBar />
            </div>
          )}
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

      {isAdminRoute && (
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

      <Layout style={{ marginLeft: isAdminRoute ? 150 : 0, minHeight: "100vh" }}>
        <Content style={{ paddingTop: "64px" }}>
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
            size="large"
            style={{
              position: "fixed",
              bottom: 10,
              right: 70,
              zIndex: 1000,
              backgroundColor: "#52c41a",
              borderColor: "#52c41a",
              width: 60,
              height: 60,
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
          {chatSessions.length > 0 ? (
            chatSessions.map((session, index) => (
              <ChatWindow
                key={`${session.userId}-${session.businessId}`}
                userId={session.userId}
                businessId={session.businessId}
                businessName={session.businessName}
                userName={session.userName}
                avatar={session.avatar}
                onClose={() => removeChatSession(session.userId, session.businessId)}
                onNewMessage={(newMessage) =>
                  handleNewMessage(newMessage, session.businessId, session.userId, session.businessName || session.userName, session.avatar)
                }
                style={{
                  bottom: 80 + index * 50,
                  right: 20,
                }}
              />
            ))
          ) : (
            <div style={{ position: "fixed", bottom: 80, right: 20, zIndex: 1000 }}>
            </div>
          )}
        </>
      )}
    </Layout>
  );
}

export default App;