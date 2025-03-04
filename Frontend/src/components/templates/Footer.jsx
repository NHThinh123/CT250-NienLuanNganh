import { Col, List, Row, Typography } from "antd";
import logo from "../../assets/logo/logo.png";
import { Link } from "react-router-dom";
import {
  DiscordOutlined,
  FacebookOutlined,
  GithubOutlined,
} from "@ant-design/icons";
const Footer = () => {
  return (
    <Row
      style={{ backgroundColor: "#fff", padding: "32px", marginTop: "32px" }}
    >
      <Col span={4}>
        <Typography.Title level={4}>Dịch vụ</Typography.Title>
        <List>
          <List.Item>
            <Link to={"/posts"}>Bài viết</Link>
          </List.Item>
          <List.Item>
            <Link to={"/"}>Trang chủ</Link>
          </List.Item>
          <List.Item>
            <Link to={"/business"}>Quán ăn</Link>
          </List.Item>
        </List>
      </Col>
      <Col span={4}>
        <Typography.Title level={4}>Hỗ trợ</Typography.Title>
        <List>
          <List.Item>
            <Link> FAQ </Link>
          </List.Item>
          <List.Item>
            <Link>Chính sách bảo mật</Link>
          </List.Item>
          <List.Item>
            <Link>Điều khoản sử dụng</Link>
          </List.Item>
        </List>
      </Col>
      <Col span={4}>
        <Typography.Title level={4}>Liên hệ</Typography.Title>
        <List>
          <List.Item>
            <Link>
              <FacebookOutlined /> Facebook
            </Link>
          </List.Item>
          <List.Item>
            <Link>
              <DiscordOutlined /> Discord
            </Link>
          </List.Item>
          <List.Item>
            <Link>
              {" "}
              <GithubOutlined /> Github
            </Link>
          </List.Item>
        </List>
      </Col>

      <Col span={12} style={{ textAlign: "right" }}>
        <img
          src={logo}
          alt="logo"
          style={{
            width: "15vw",
            height: "15vh",
            objectFit: "contain",
            marginTop: "-10px",
          }}
        />
        <Typography.Paragraph style={{ marginInline: "10px" }}>
          Yumzy là nền tảng đánh giá và chia sẻ những câu chuyện thú vị về ẩm
          thực khắp mọi nơi. Chúng tôi mong muốn tạo ra một cộng đồng ẩm thực
          văn minh, đa dạng và phong phú.
        </Typography.Paragraph>
      </Col>
    </Row>
  );
};

export default Footer;
