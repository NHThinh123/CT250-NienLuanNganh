import { EllipsisOutlined } from "@ant-design/icons";
import { Avatar, Col, Row, Typography } from "antd";

const PostHeader = ({ userData }) => {
  return (
    <Row>
      <Col span={2} style={{ textAlign: "center" }}>
        <Avatar
          src={
            "https://anhnail.com/wp-content/uploads/2024/11/Hinh-gai-xinh-2k4.jpg"
          }
        ></Avatar>
      </Col>
      <Col span={20}>
        <Typography.Title level={5}>{userData?.name}</Typography.Title>
      </Col>
      <Col span={2} style={{ textAlign: "center" }}>
        <EllipsisOutlined />
      </Col>
    </Row>
  );
};

export default PostHeader;
