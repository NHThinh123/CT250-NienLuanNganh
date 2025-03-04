import { EllipsisOutlined } from "@ant-design/icons";
import { Avatar, Button, Col, Row, Typography } from "antd";
import { formatTime } from "../../../../constants/formatTime";

const PostHeader = ({ userData, createAt }) => {
  return (
    <Row align={"middle"}>
      <Col span={2} style={{ textAlign: "center" }}>
        <Avatar
          size={"large"}
          src={
            userData?.avatar ||
            "https://res.cloudinary.com/nienluan/image/upload/v1741015659/default-avatar-profile-icon-social-media-user-image-gray-avatar-icon-blank-profile-silhouette-illustration-vector_d3dgki.jpg"
          }
        ></Avatar>
      </Col>
      <Col span={20}>
        <Typography.Title level={5} style={{ marginBottom: 0 }}>
          {userData?.name}
        </Typography.Title>
        <Typography.Text>{formatTime(createAt)}</Typography.Text>
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
