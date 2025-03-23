//ReviewResponseList.jsx
import { Avatar, List, Typography, Row, Col, Button } from "antd";
import { formatTime } from "../../../../constants/formatTime";
import useReviewResponseByParentReviewId from "../../hooks/useReviewResponseByParentReviewId";
import { CheckCircleFilled } from "@ant-design/icons";
import { useState } from "react";

const ReviewResponseList = ({ parentReviewId }) => {
  const { reviewResponseData } =
    useReviewResponseByParentReviewId(parentReviewId);
  const [isShowResponses, setIsShowResponses] = useState(false);

  const MAX_CHARS = 120;

  const responseCount = reviewResponseData.length;

  const handleToggleResponses = () => {
    setIsShowResponses(!isShowResponses);
  };
  return (
    <>
      {responseCount > 0 && (
        <>
          <Row>
            <Col span={24}>
              <Button
                type="link"
                onClick={handleToggleResponses}
                style={{
                  padding: 0,
                  color: "#1890ff",
                  fontSize: 12,
                }}
              >
                {isShowResponses
                  ? `Ẩn ${responseCount} phản hồi`
                  : `Xem ${responseCount} phản hồi`}
              </Button>
            </Col>
          </Row>

          {isShowResponses && (
            <List
              style={{ justifyContent: "center" }}
              grid={{ gutter: 16, column: 1 }}
              dataSource={reviewResponseData}
              renderItem={(review) => {
                const [isShowFullContent, setIsShowFullContent] =
                  // eslint-disable-next-line react-hooks/rules-of-hooks
                  useState(false);
                const isLongContent = review.review_contents.length > MAX_CHARS;
                const shortContent = isLongContent
                  ? review.review_contents.substring(0, MAX_CHARS) + "..."
                  : review.review_contents;

                const toggleContent = () => {
                  setIsShowFullContent(!isShowFullContent);
                };
                return (
                  <List.Item>
                    <Row>
                      <Col span={24} style={{ display: "flex" }}>
                        <div style={{ margin: "7px 7px 0 0" }}>
                          <Avatar
                            src={
                              review.user_id?.avatar ||
                              review.business_id_review?.avatar ||
                              review.business_id_feedback?.avatar ||
                              "https://res.cloudinary.com/nienluan/image/upload/v1741015659/default-avatar-profile-icon-social-media-user-image-gray-avatar-icon-blank-profile-silhouette-illustration-vector_d3dgki.jpg"
                            }
                            size={25}
                          />
                        </div>
                        <div>
                          <div
                            style={{
                              backgroundColor: "#F5F5F5",
                              borderRadius: 10,
                              padding: "8px 12px",
                              display: "inline-block",
                              maxWidth: "100%",
                            }}
                          >
                            <div>
                              <p
                                style={{
                                  fontWeight: "bold",
                                  margin: 0,
                                  fontSize: 13,
                                }}
                              >
                                {review.user_id?.name ||
                                  review.business_id_review?.business_name ||
                                  review.business_id_feedback?.business_name}
                                {review.business_id_feedback?.business_name && (
                                  <CheckCircleFilled
                                    style={{
                                      color: "blue",
                                      marginLeft: 3,
                                    }}
                                  />
                                )}
                              </p>
                            </div>
                            <div>
                              <p style={{ margin: 0, fontSize: 13 }}>
                                {isShowFullContent || !isLongContent
                                  ? review.review_contents
                                  : shortContent}
                              </p>
                              {isLongContent && (
                                <Button
                                  type="link"
                                  onClick={toggleContent}
                                  style={{
                                    padding: 0,
                                    height: "auto",
                                    color: "#1890ff",
                                    fontSize: 12,
                                  }}
                                >
                                  {isShowFullContent ? "Thu gọn" : "Xem thêm"}
                                </Button>
                              )}
                            </div>
                          </div>
                          <Row
                            style={{
                              alignItems: "center",
                              display: "flex",
                              gap: 8,
                            }}
                          >
                            <Typography.Text
                              style={{
                                marginLeft: 7,
                                color: "#6D6F71",
                                fontSize: 12,
                              }}
                            >
                              {formatTime(review.createdAt)}
                            </Typography.Text>
                          </Row>
                        </div>
                      </Col>
                    </Row>
                  </List.Item>
                );
              }}
            />
          )}
        </>
      )}
    </>
  );
};

export default ReviewResponseList;
