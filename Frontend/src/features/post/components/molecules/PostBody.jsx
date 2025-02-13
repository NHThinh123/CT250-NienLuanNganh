import { Col, Row, Typography } from "antd";

const PostBody = ({ postData }) => {
  return (
    <div style={{ margin: "8px" }}>
      <Row>
        <Col span={24}>
          <Typography.Title level={4}>{postData?.title}</Typography.Title>
        </Col>
      </Row>
      <Row>
        <Col span={24}>{postData?.content}</Col>
      </Row>
    </div>
  );
};

export default PostBody;
