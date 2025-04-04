import { Col, Row, Typography } from "antd";
import BannerHome from "../features/home/components/templates/BannerHome";

import ListBusinessHome from "../features/home/components/templates/ListBusinessHome";
import ListPostHome from "../features/home/components/templates/ListPostHome";

const HomePage = () => {
  return (
    <Row justify="center" style={{ marginTop: 68 }}>
      <Col span={24}>
        <BannerHome />
      </Col>
      <Col span={22}>
        <ListBusinessHome />
      </Col>
      <Col span={22}>
        <Typography.Title
          level={2}
          style={{ fontWeight: "bold", marginTop: 32 }}
        >
          Bài Viết Nổi Bật
        </Typography.Title>
        <ListPostHome />
      </Col>
    </Row>
  );
};

export default HomePage;
