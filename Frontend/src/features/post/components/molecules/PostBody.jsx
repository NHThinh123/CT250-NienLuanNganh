import { Col, Row, Tag, Typography } from "antd";
import PostLinkedBusiness from "./PostLinkedBusiness";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

const PostBody = ({ postData }) => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [isExpanded, setIsExpanded] = useState(false); // Trạng thái mở rộng nội dung

  // Theo dõi kích thước màn hình
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Hàm kiểm tra xem nội dung có vượt quá 5 dòng không (ước lượng dựa trên độ dài ký tự)
  const isContentLong = postData?.content?.length > 200; // Giả sử 200 ký tự ~ 5 dòng, có thể điều chỉnh

  // Hàm xử lý mở rộng/thu gọn nội dung
  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div
      style={{
        margin: windowWidth <= 576 ? "4px" : windowWidth <= 768 ? "6px" : "8px",
        padding: windowWidth <= 576 ? "4px" : "0px",
      }}
    >
      <Row gutter={[0, 4]}>
        <Col xs={24} sm={24} md={24}>
          <Typography.Title
            level={4}
            style={{
              margin: windowWidth <= 576 ? "4px 0" : "8px 0",
              fontSize:
                windowWidth <= 576
                  ? "16px"
                  : windowWidth <= 768
                  ? "18px"
                  : "20px",
            }}
          >
            {postData?.title}
          </Typography.Title>
          {postData?.edited && (
            <Typography.Text
              type="secondary"
              style={{
                fontSize: windowWidth <= 576 ? "12px" : "14px",
              }}
            >
              (Đã chỉnh sửa)
            </Typography.Text>
          )}
        </Col>
      </Row>
      <Row gutter={[0, 4]}>
        <Col xs={24} sm={24} md={24}>
          {postData?.tags?.length > 0 && (
            <div style={{ marginBottom: windowWidth <= 576 ? "4px" : "8px" }}>
              {postData.tags.map((tag) => (
                <Tag
                  key={tag.tag_name}
                  color="blue"
                  style={{
                    margin: windowWidth <= 576 ? "0 4px 4px 0" : "0 8px 8px 0",
                    fontSize: windowWidth <= 576 ? "12px" : "14px",
                  }}
                >
                  {tag.tag_name}
                </Tag>
              ))}
            </div>
          )}
        </Col>
      </Row>
      <Row gutter={[0, 4]}>
        <Col xs={24} sm={24} md={24}>
          <p
            style={{
              fontSize:
                windowWidth <= 576
                  ? "14px"
                  : windowWidth <= 768
                  ? "15px"
                  : "16px",
              marginBottom: 0,
              display: "-webkit-box",
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              WebkitLineClamp: isExpanded ? "unset" : 5, // Giới hạn 5 dòng khi chưa mở rộng
              whiteSpace: isExpanded ? "normal" : "pre-wrap", // Giữ định dạng khi mở rộng
            }}
          >
            {postData?.content}
          </p>
          {isContentLong && (
            <Typography.Link
              onClick={toggleExpand}
              style={{
                fontSize: windowWidth <= 576 ? "12px" : "14px",
                marginTop: "4px",
                display: "block",
              }}
            >
              {isExpanded ? "Thu gọn" : "Xem thêm"}
            </Typography.Link>
          )}
        </Col>
      </Row>
      {postData?.linked_business_id && (
        <Row gutter={[0, 4]}>
          <Col xs={24} sm={24} md={24}>
            <Typography.Text
              italic
              type="secondary"
              style={{
                fontSize: windowWidth <= 576 ? "12px" : "14px",
              }}
            >
              Thông tin quán ăn:
            </Typography.Text>
            <Link to={`/businesses/${postData.linked_business_id}`}>
              <PostLinkedBusiness linked_business={postData?.linked_business} />
            </Link>
          </Col>
        </Row>
      )}
    </div>
  );
};

export default PostBody;
