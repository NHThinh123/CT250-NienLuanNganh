import { Button, Card, Col, Row } from "antd";

import { formatTime } from "../../../../constants/formatTime";

const PostOverviewCard = ({ post }) => {
  if (!post) return <>loading</>;
  const renderMedia = (item) => {
    if (item?.type === "image") {
      return (
        <img
          src={item.url}
          alt={`Media`}
          style={{ maxHeight: "200px", width: "100%", objectFit: "cover" }}
          onContextMenu={(e) => e.preventDefault()}
          draggable="false"
        />
      );
    } else if (item?.type === "video") {
      return (
        <video
          src={item.url}
          style={{ maxHeight: "200px", width: "100%", objectFit: "cover" }}
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
        style={{ maxHeight: "200px", width: "100%", objectFit: "cover" }}
      />
    );
  };

  return (
    <Card cover={renderMedia(post?.media[0])} style={{ margin: 8 }}>
      <h3
        style={{
          display: "-webkit-box",
          WebkitLineClamp: 1,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
          textOverflow: "ellipsis",
          marginBottom: 4,
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
        }}
      >
        {post?.content}
      </p>
      <Row justify="space-between" style={{ marginTop: 8, fontWeight: "bold" }}>
        <Col span={12}>Số lượt thích:</Col>
        <Col span={12} style={{ textAlign: "right" }}>
          {post?.likeCount}
        </Col>
      </Row>
      <Row justify="space-between" style={{ marginTop: 8, fontWeight: "bold" }}>
        <Col span={12}>Số lượt bình luận:</Col>
        <Col span={12} style={{ textAlign: "right" }}>
          {post?.commentCount}
        </Col>
      </Row>
      <Row justify="space-between" style={{ marginTop: 8, fontWeight: "bold" }}>
        <Col span={12}>Thời gian đăng tải:</Col>
        <Col span={12} style={{ textAlign: "right" }}>
          {formatTime(post?.createdAt)}
        </Col>
      </Row>
      <Row justify="space-between" style={{ marginTop: 8 }}>
        <Col span={24}>
          <Button type="primary" style={{ width: "100%" }}>
            Xem bài viết
          </Button>
        </Col>
      </Row>
    </Card>
  );
};

export default PostOverviewCard;
