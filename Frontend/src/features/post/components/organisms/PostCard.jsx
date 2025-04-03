import { Avatar, Col, Row, Space, Tag, Typography } from "antd";
import BoxContainer from "../../../../components/atoms/BoxContainer";
import {
  CheckCircleFilled,
  HeartFilled,
  MessageOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

const PostCard = ({ post }) => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  // Theo dõi kích thước màn hình
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Hàm render media (ảnh hoặc video)
  const renderMedia = () => {
    const firstMedia = post.media?.[0];
    const mediaStyle = {
      width: windowWidth <= 576 ? "100%" : windowWidth <= 768 ? "100%" : 500, // Toàn chiều rộng trên mobile và tablet
      height: windowWidth <= 768 ? "auto" : 230, // Tự động trên mobile/tablet, cố định trên desktop
      objectFit: "cover",
    };

    if (!firstMedia) {
      return (
        <img
          src="https://res.cloudinary.com/nienluan/image/upload/v1741245839/Business_Avatar_Default_jkhjhf.jpg"
          alt="Fallback"
          style={mediaStyle}
        />
      );
    }

    if (firstMedia.type === "image") {
      return (
        <img
          src={firstMedia.url}
          alt={post.title}
          style={mediaStyle}
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
          style={mediaStyle}
          onContextMenu={(e) => e.preventDefault()}
          draggable="false"
        />
      );
    }
    return (
      <img
        src="https://res.cloudinary.com/nienluan/image/upload/v1741245839/Business_Avatar_Default_jkhjhf.jpg"
        alt="Fallback"
        style={mediaStyle}
      />
    );
  };

  return (
    <Link
      to={`/posts/${post._id}`}
      style={{ textDecoration: "none", color: "inherit" }}
    >
      <BoxContainer style={{ padding: windowWidth <= 768 ? "0" : "0px" }}>
        <Row gutter={[16, 16]}>
          <Col
            xs={24} // Mobile nhỏ (<576px): Toàn chiều rộng
            sm={24} // Tablet nhỏ (576px - 768px): Nửa chiều rộng
            md={11} // Tablet lớn/Desktop nhỏ (768px - 992px): 10/24
            lg={10} // Desktop (992px - 1200px): 10/24
            xl={10} // Desktop lớn (1200px - 1600px): 10/24
            xxl={10} // Desktop rất lớn (>1600px): 10/24
            style={{
              // maxHeight: windowWidth <= 768 ? "auto" : 230,
              overflow: "hidden",
              // paddingRight: windowWidth > 768 ? "32px" : 0,
            }}
          >
            {renderMedia()}
          </Col>
          <Col
            xs={24} // Mobile nhỏ (<576px): Toàn chiều rộng
            sm={24} // Tablet nhỏ (576px - 768px): Nửa chiều rộng
            md={13} // Tablet lớn/Desktop nhỏ (768px - 992px): 14/24
            lg={14} // Desktop (992px - 1200px): 14/24
            xl={14} // Desktop lớn (1200px - 1600px): 14/24
            xxl={14} // Desktop rất lớn (>1600px): 14/24
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                height: "100%",
                justifyContent: "space-between",
                padding: windowWidth <= 768 ? "8px" : "16px",
              }}
            >
              <div>
                <h1
                  style={{
                    marginBottom: 4,
                    display: "-webkit-box",
                    WebkitBoxOrient: "vertical",
                    WebkitLineClamp: 1,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    fontSize: windowWidth <= 768 ? "1.2em" : "1.5em",
                    marginTop: 8,
                  }}
                >
                  {post.title}
                </h1>
                {post?.edited && (
                  <Typography.Text type="secondary">
                    (Đã chỉnh sửa)
                  </Typography.Text>
                )}
                <Col span={24} style={{ marginBottom: "8px", paddingLeft: 0 }}>
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
                    WebkitLineClamp: windowWidth <= 768 ? 1 : 2,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    fontSize: windowWidth <= 768 ? "14px" : "16px",
                  }}
                >
                  <p style={{ margin: 0 }}>{post.content}</p>
                </div>
                {post.content.length > 400 && (
                  <Typography.Text style={{ color: "#1890ff" }}>
                    Xem thêm
                  </Typography.Text>
                )}
                <br />
                <Space align="center" style={{ marginTop: "8px" }}>
                  <Avatar
                    src={
                      post?.author?.avatar ||
                      "https://res.cloudinary.com/nienluan/image/upload/v1741015659/default-avatar-profile-icon-social-media-user-image-gray-avatar-icon-blank-profile-silhouette-illustration-vector_d3dgki.jpg"
                    }
                    size={windowWidth <= 768 ? 16 : 20}
                  />
                  <p style={{ marginBottom: "0" }}>
                    {post.author?.name}
                    {post?.business_id && (
                      <Typography.Text
                        style={{
                          fontSize: windowWidth <= 768 ? 12 : 14,
                          marginLeft: 8,
                          color: "#1890ff",
                        }}
                      >
                        <CheckCircleFilled /> - Quán ăn
                      </Typography.Text>
                    )}
                  </p>
                </Space>
              </div>
              <div>
                <Row style={{ margin: "8px 0px" }} gutter={[8, 8]}>
                  <Col xs={12} sm={12} md={8} lg={6} xl={4} xxl={4}>
                    <HeartFilled
                      style={{
                        color: post.isLike ? "#ff4d4f" : "gray",
                        marginRight: "4px",
                      }}
                    />
                    <Typography.Text
                      style={{
                        color: post.isLike ? "#ff4d4f" : "black",
                        fontSize: windowWidth <= 768 ? "12px" : "14px",
                      }}
                    >
                      {post.likeCount} Yêu thích
                    </Typography.Text>
                  </Col>
                  <Col xs={12} sm={12} md={8} lg={6} xl={4} xxl={4}>
                    <MessageOutlined style={{ marginRight: "4px" }} />
                    <Typography.Text
                      style={{
                        fontSize: windowWidth <= 768 ? "12px" : "14px",
                      }}
                    >
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
