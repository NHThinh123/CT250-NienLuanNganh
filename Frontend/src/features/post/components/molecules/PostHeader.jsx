import { CheckCircleFilled, EllipsisOutlined } from "@ant-design/icons";
import { Avatar, Button, Col, Row, Typography } from "antd";
import { formatTime } from "../../../../constants/formatTime";
import { Link } from "react-router-dom";

const PostHeader = ({ userData, createAt, isBusiness }) => {
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
          {isBusiness && (
            <Link
              style={{ fontSize: 14, marginLeft: 8 }}
              to={`/businesses/${userData?.id}`}
            >
              <CheckCircleFilled /> - Quán ăn
            </Link>
          )}
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
