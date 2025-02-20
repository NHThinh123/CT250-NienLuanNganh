import { Outlet, useNavigate } from "react-router-dom";
import { Layout, Button, Space } from "antd";
import NavBar from "./components/templates/NavBar";
import logo from "../src/assets/logo/logo.png";
import Footer from "./components/templates/Footer";
import ScrollToTop from "./components/atoms/ScrollToTop";

function App() {
  const navigate = useNavigate(); // Hook để chuyển trang

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
          <Button type="primary" onClick={() => navigate("/login")}>
            Đăng nhập
          </Button>
          <Button onClick={() => navigate("/signup")}>Đăng ký</Button>
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
