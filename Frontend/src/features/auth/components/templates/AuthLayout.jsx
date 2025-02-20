import { Layout } from "antd";
import logo from "../../../../assets/logo/logo.png";

const AuthLayout = ({ children }) => {
    return (
        <Layout style={{ minHeight: "100vh", background: "#f5f5f5", position: "relative" }}>
            <img
                src={logo}
                alt="Logo"
                style={{
                    position: "absolute",
                    top: "20px",
                    left: "30px",
                    width: "120px",
                }}
            />
            {children}
        </Layout>
    );
};

export default AuthLayout;
