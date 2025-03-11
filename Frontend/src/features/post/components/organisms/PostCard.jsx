import { Avatar, Col, Row, Space, Tag, Typography } from "antd";
import logo from "../../../../assets/logo/logo.png";
import BoxContainer from "../../../../components/atoms/BoxContainer";
import {
  CheckCircleFilled,
  HeartFilled,
  MessageOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";

const PostCard = ({ post }) => {
  // Hàm render media (ảnh hoặc video)
  const renderMedia = () => {
    const firstMedia = post.media?.[0];
    if (!firstMedia) {
      return (
        <img
          src={logo}
          alt="Fallback"
          style={{ maxWidth: 400, objectFit: "cover" }}
        />
      );
    }

    if (firstMedia.type === "image") {
      return (
        <img
          src={firstMedia.url}
          alt={post.title}
          style={{ maxWidth: 400, objectFit: "cover" }}
          onContextMenu={(e) => e.preventDefault()}
          draggable="false"
        />
      );
    } else if (firstMedia.type === "video") {
      return (
        <video
          src={firstMedia.url}
          muted
          autoPlay={false}
          style={{ maxWidth: 400, objectFit: "cover" }}
          onContextMenu={(e) => e.preventDefault()}
          draggable="false"
        />
      );
    }
    return (
      <img
        src={logo}
        alt="Fallback"
        style={{ maxWidth: 400, objectFit: "cover" }}
      />
    );
  };

  return (
    <Link
      to={`/posts/${post._id}`}
      style={{ textDecoration: "none", color: "inherit" }}
    >
      <BoxContainer style={{ padding: "0px" }}>
        <Row>
          <Col
            span={10}
            style={{
              maxWidth: 400,
              maxHeight: 250,
              overflow: "hidden",
              marginRight: "32px",
            }}
          >
            {renderMedia()}
          </Col>
          <Col span={14}>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                height: "100%",
                justifyContent: "space-between", // Cải thiện layout
              }}
            >
              <div>
                <h1 style={{ marginBottom: 4, fontSize: "1.5em" }}>
                  {post.title}
                </h1>
                <Col span={24} style={{ marginBottom: "8px" }}>
                  {post?.tags?.length > 0 &&
                    post.tags.map((tag) => (
                      <Tag key={tag.tag_name} color="blue">
                        {tag.tag_name}
                      </Tag>
                    ))}
                </Col>
                <div
                  style={{
                    display: "-webkit-box",
                    WebkitBoxOrient: "vertical",
                    WebkitLineClamp: 4,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    lineHeight: "1.5em",
                    maxHeight: "6em",
                  }}
                >
                  <p style={{ margin: 0 }}>{post.content}</p>
                </div>
                {post.content.length > 400 && (
                  <Typography.Text style={{ color: "#1890ff" }}>
                    Xem thêm
                  </Typography.Text>
                )}
              </div>

              <div>
                <Space align="center" style={{ marginTop: "8px" }}>
                  <Avatar
                    src={
                      post?.author?.avatar ||
                      "https://res.cloudinary.com/nienluan/image/upload/v1741015659/default-avatar-profile-icon-social-media-user-image-gray-avatar-icon-blank-profile-silhouette-illustration-vector_d3dgki.jpg"
                    }
                    size={20}
                  />
                  <p style={{ marginBottom: "0" }}>
                    {post.author?.name}
                    {post?.business_id && (
                      <Link
                        style={{ fontSize: 14, marginLeft: 8 }}
                        to={`/businesses/${post.author?.id}`}
                      >
                        <CheckCircleFilled /> - Quán ăn
                      </Link>
                    )}
                  </p>
                </Space>
              </div>
              <div>
                <Row style={{ margin: "8px 0px" }} gutter={8}>
                  <Col span={4}>
                    <HeartFilled
                      style={{
                        color: post.isLike ? "#ff4d4f" : "gray",
                        marginRight: "4px",
                      }}
                    />
                    <Typography.Text
                      style={{
                        color: post.isLike ? "#ff4d4f" : "black",
                      }}
                    >
                      {post.likeCount} Yêu thích
                    </Typography.Text>
                  </Col>
                  <Col span={4}>
                    <MessageOutlined style={{ marginRight: "4px" }} />
                    <Typography.Text>
                      {post.commentCount} Bình luận
                    </Typography.Text>
                  </Col>
                </Row>
              </div>
            </div>
          </Col>
        </Row>
      </BoxContainer>
    </Link>
  );
};

export default PostCard;
