import {
  HeartFilled,
  MessageOutlined,
  ShareAltOutlined,
} from "@ant-design/icons";
import { Button, Col, Row, Typography } from "antd";

const PostFooter = () => {
  return (
    <>
      <Row style={{ textAlign: "center" }}>
        <Col span={8}>
          <Button type="text">
            <HeartFilled />
            <Typography.Text>Yêu thích</Typography.Text>
          </Button>
        </Col>
        <Col span={8}>
          <Button type="text">
            <MessageOutlined />
            <Typography.Text> Bình luận</Typography.Text>
          </Button>
        </Col>
        <Col span={8}>
          <Button type="text">
            <ShareAltOutlined />
            <Typography.Text>Chia sẻ</Typography.Text>
          </Button>
        </Col>
      </Row>
    </>
  );
};

export default PostFooter;
