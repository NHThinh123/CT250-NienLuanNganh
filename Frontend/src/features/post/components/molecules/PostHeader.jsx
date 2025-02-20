import { EllipsisOutlined } from "@ant-design/icons";
import { Avatar, Button, Col, Row, Typography } from "antd";

const PostHeader = ({ userData }) => {
  return (
    <Row>
      <Col span={2} style={{ textAlign: "center" }}>
        <Avatar src={userData?.avatar}></Avatar>
      </Col>
      <Col span={20}>
        <Typography.Title level={5}>{userData?.name}</Typography.Title>
      </Col>
      <Col span={2} style={{ textAlign: "center" }}>
        <Button type="text">
          <EllipsisOutlined />
        </Button>
      </Col>
    </Row>
  );
};

export default PostHeader;
