import { Col, List, Row, Typography } from "antd";
import logo from "../../assets/logo/logo.png";
import { Link } from "react-router-dom";
import {
  DiscordOutlined,
  FacebookOutlined,
  GithubOutlined,
} from "@ant-design/icons";
import { useState, useEffect } from "react";

const Footer = () => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  // Theo dõi kích thước màn hình
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <Row
      style={{
        backgroundColor: "#fff",
        padding: windowWidth <= 768 ? "16px" : "32px", // Giảm padding trên mobile
        marginTop: "32px",
      }}
      gutter={[16, 16]} // Khoảng cách giữa các cột và hàng
    >
      <Col
        xs={12} // Chiếm toàn bộ chiều rộng trên mobile
        sm={12} // Chiếm nửa chiều rộng trên tablet
        md={4} // Chiếm 4/24 trên desktop
      >
        <Typography.Title level={4}>Dịch vụ</Typography.Title>
        <List>
          <List.Item>
            <Link to={"/posts"}>Bài viết</Link>
          </List.Item>
          <List.Item>
            <Link to={"/"}>Trang chủ</Link>
          </List.Item>
          <List.Item>
            <Link to={"/businesses"}>Quán ăn</Link>
          </List.Item>
        </List>
      </Col>
      <Col xs={12} sm={12} md={4}>
        <Typography.Title level={4}>Hỗ trợ</Typography.Title>
        <List>
          <List.Item>
            <Link to={"/faq"}>FAQ</Link>
          </List.Item>
          <List.Item>
            <Link to={"/privacy-policy"}>Chính sách bảo mật</Link>
          </List.Item>
          <List.Item>
            <Link to={"/terms-of-use"}>Điều khoản sử dụng</Link>
          </List.Item>
        </List>
      </Col>
      <Col xs={12} sm={12} md={4}>
        <Typography.Title level={4}>Liên hệ</Typography.Title>
        <List>
          <List.Item>
            <a href="https://facebook.com">
              <FacebookOutlined /> Facebook
            </a>
          </List.Item>
          <List.Item>
            <a href="https://discord.com">
              <DiscordOutlined /> Discord
            </a>
          </List.Item>
          <List.Item>
            <a href="https://github.com/">
              <GithubOutlined /> Github
            </a>
          </List.Item>
        </List>
      </Col>
      <Col
        xs={12}
        sm={12}
        md={12}
        style={{
          textAlign: windowWidth <= 768 ? "left" : "right", // Căn trái trên mobile, căn phải trên desktop
        }}
      >
        <img
          src={logo}
          alt="logo"
          style={{
            width: windowWidth <= 768 ? "30vw" : "15vw", // Thu nhỏ logo trên mobile
            height: windowWidth <= 768 ? "10vh" : "15vh",
            objectFit: "contain",
            marginTop: "-20px",
          }}
        />
        <Typography.Paragraph
          style={{
            marginInline: "10px",
            fontSize: windowWidth <= 768 ? "14px" : "16px", // Giảm cỡ chữ trên mobile
          }}
        >
          Yumzy là nền tảng đánh giá và chia sẻ những câu chuyện thú vị về ẩm
          thực khắp mọi nơi. Chúng tôi mong muốn tạo ra một cộng đồng ẩm thực
          văn minh, đa dạng và phong phú.
        </Typography.Paragraph>
      </Col>
    </Row>
  );
};

export default Footer;
