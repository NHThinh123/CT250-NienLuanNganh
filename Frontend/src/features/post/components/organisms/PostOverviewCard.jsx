import { useState, useEffect } from "react";
import { Button, Card, Col, Row } from "antd";
import { formatTime } from "../../../../constants/formatTime";

const PostOverviewCard = ({ post }) => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  // Theo dõi kích thước màn hình
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (!post)
    return (
      <div style={{ fontSize: windowWidth <= 576 ? "14px" : "16px" }}>
        Đang tải...
      </div>
    );

  const renderMedia = (item) => {
    const mediaHeight =
      windowWidth <= 576 ? "150px" : windowWidth <= 768 ? "180px" : "200px"; // Responsive height
    if (item?.type === "image") {
      return (
        <img
          src={item.url}
          alt={`Media`}
          style={{
            maxHeight: mediaHeight,
            width: "100%",
            objectFit: "cover",
          }}
          onContextMenu={(e) => e.preventDefault()}
          draggable="false"
        />
      );
    } else if (item?.type === "video") {
      return (
        <video
          src={item.url}
          style={{
            maxHeight: mediaHeight,
            width: "100%",
            objectFit: "cover",
          }}
          onContextMenu={(e) => e.preventDefault()}
          draggable="false"
        />
      );
    }
    return (
      <img
        src={
          "https://res.cloudinary.com/nienluan/image/upload/v1741245839/Business_Avatar_Default_jkhjhf.jpg"
        }
        alt="Fallback"
        style={{
          maxHeight: mediaHeight,
          width: "100%",
          objectFit: "cover",
        }}
      />
    );
  };

  return (
    <Card
      cover={renderMedia(post?.media[0])}
      style={{
        margin: windowWidth <= 576 ? 4 : 8, // Responsive margin
        padding: windowWidth <= 576 ? "4px" : "8px", // Responsive padding
      }}
    >
      <h3
        style={{
          display: "-webkit-box",
          WebkitLineClamp: 1,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
          textOverflow: "ellipsis",
          marginBottom: windowWidth <= 576 ? 2 : 4,
          fontSize:
            windowWidth <= 576 ? "16px" : windowWidth <= 768 ? "18px" : "20px", // Responsive font
        }}
      >
        {post?.title}
      </h3>
      <p
        style={{
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
          textOverflow: "ellipsis",
          fontSize:
            windowWidth <= 576 ? "14px" : windowWidth <= 768 ? "15px" : "16px", // Responsive font
          marginBottom: windowWidth <= 576 ? 4 : 8,
        }}
      >
        {post?.content}
      </p>
      <Row
        justify="space-between"
        style={{
          marginTop: windowWidth <= 576 ? 4 : 8,
          fontWeight: "bold",
        }}
      >
        <Col
          span={12}
          style={{ fontSize: windowWidth <= 576 ? "12px" : "14px" }}
        >
          Số lượt thích:
        </Col>
        <Col
          span={12}
          style={{
            textAlign: "right",
            fontSize: windowWidth <= 576 ? "12px" : "14px",
          }}
        >
          {post?.likeCount}
        </Col>
      </Row>
      <Row
        justify="space-between"
        style={{
          marginTop: windowWidth <= 576 ? 4 : 8,
          fontWeight: "bold",
        }}
      >
        <Col
          span={12}
          style={{ fontSize: windowWidth <= 576 ? "12px" : "14px" }}
        >
          Số lượt bình luận:
        </Col>
        <Col
          span={12}
          style={{
            textAlign: "right",
            fontSize: windowWidth <= 576 ? "12px" : "14px",
          }}
        >
          {post?.commentCount}
        </Col>
      </Row>
      <Row
        justify="space-between"
        style={{
          marginTop: windowWidth <= 576 ? 4 : 8,
          fontWeight: "bold",
        }}
      >
        <Col
          span={12}
          style={{ fontSize: windowWidth <= 576 ? "12px" : "14px" }}
        >
          Thời gian đăng tải:
        </Col>
        <Col
          span={12}
          style={{
            textAlign: "right",
            fontSize: windowWidth <= 576 ? "12px" : "14px",
          }}
        >
          {formatTime(post?.createdAt)}
        </Col>
      </Row>
      <Row
        justify="space-between"
        style={{
          marginTop: windowWidth <= 576 ? 8 : 12,
        }}
      >
        <Col span={24}>
          <Button
            type="primary"
            size={windowWidth <= 576 ? "middle" : "large"} // Responsive size
            style={{ width: "100%" }}
          >
            Xem bài viết
          </Button>
        </Col>
      </Row>
    </Card>
  );
};

export default PostOverviewCard;
