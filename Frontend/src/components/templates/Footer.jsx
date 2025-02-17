import { Col, Row, Typography } from "antd";
import BoxContainer from "../atoms/BoxContainer";
import { Link } from "react-router-dom";
import {
  DiscordOutlined,
  FacebookOutlined,
  GithubOutlined,
} from "@ant-design/icons";

const Footer = () => {
  return (
    <BoxContainer>
      <Typography.Title level={4}>Về chúng tôi</Typography.Title>
      <Typography.Text>
        Yumzy là nền tảng đánh giá và chia sẻ những câu chuyện thú vị về ẩm thực
        khắp nơi trên thế giới. Chúng tôi mong muốn tạo ra một cộng đồng ẩm thực
        văn minh, đa dạng và phong phú.
      </Typography.Text>
      <Typography.Title level={4}>Liên hệ</Typography.Title>
      <Row style={{ marginTop: "16px" }} gutter={[16, 16]}>
        <Col span={24}>
          <Link>
            <FacebookOutlined /> Facebook
          </Link>
        </Col>
        <Col span={24}>
          <Link>
            <DiscordOutlined /> Discord
          </Link>
        </Col>
        <Col span={24}>
          <Link>
            <GithubOutlined /> Github
          </Link>
        </Col>
      </Row>
    </BoxContainer>
  );
};

export default Footer;
