import { Layout } from "antd";
import logo from "../../../../assets/logo/logo.png";
import { Link } from "react-router-dom"; // Nhập từ react-router-dom thay vì lucide-react

const AuthLayout = ({ children }) => {
  return (
    <Layout
      style={{
        minHeight: "100vh",
        background: "#f5f5f5",
        position: "relative",
      }}
    >
      <Link to="/">
        {" "}
        {/* Liên kết đến trang chủ */}
        <img
          src={logo}
          alt="Logo"
          style={{
            position: "absolute",
            top: "10px",
            left: "30px",
            width: "120px",
            cursor: "pointer", // Thêm con trỏ để biểu thị có thể nhấp
          }}
        />
      </Link>

      {children}
    </Layout>
  );
};

export default AuthLayout;
