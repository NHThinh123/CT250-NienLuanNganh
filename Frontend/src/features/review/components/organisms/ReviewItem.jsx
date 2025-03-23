// ReviewItem.jsx
import { Avatar, Rate, Typography, Row, Col, Button, Form } from "antd";
import { SendOutlined } from "@ant-design/icons";
import TextArea from "antd/es/input/TextArea";
import ReviewResponseList from "../molecules/ReviewResponseList";
import "../../../../styles/global.css";
import LoginRequiredModal from "../../../../components/organisms/LoginRequiredModal";
import { useAuthEntity } from "../../../../hooks/useAuthEntry";
import { useContext, useEffect, useRef, useState } from "react";
import { formatTime } from "../../../../constants/formatTime";
import useCreateReview from "../../hooks/useCreateReview";
import { AuthContext } from "../../../../contexts/auth.context";
import { BusinessContext } from "../../../../contexts/business.context";

const ReviewItem = ({ review, businessId }) => {
  const { auth } = useContext(AuthContext);
  const { business } = useContext(BusinessContext);
  const { entity } = useAuthEntity();
  const [form] = Form.useForm();
  const [isLoginRequiredModalOpen, setIsLoginRequiredModalOpen] =
    useState(false);
  const [isShowReply, setIsShowReply] = useState(false);
  const [isShowFullContent, setIsShowFullContent] = useState(false);

  const MAX_CHARS = 120;
  const isLongContent = review.review_contents.length > MAX_CHARS;
  const shortContent = isLongContent
    ? review.review_contents.substring(0, MAX_CHARS) + "..."
    : review.review_contents;

  const { mutate: createReview, isLoading } = useCreateReview();

  useEffect(() => {
    setIsShowReply(false); // Đặt lại trạng thái về false khi review thay đổi
  }, [review._id]);

  const handleShowReply = () => {
    setIsShowReply(!isShowReply);
  };

  const toggleContent = () => {
    setIsShowFullContent(!isShowFullContent);
  };

  const showLoginRequiredModal = () => {
    setIsLoginRequiredModalOpen(true);
  };

  const handleCancel = () => {
    setIsLoginRequiredModalOpen(false);
  };

  const handleAction = (action) => {
    if (!entity?.id) {
      showLoginRequiredModal();
    } else {
      action();
    }
  };

  const handleReply = (values) => {
    if (!values.review_contents?.trim()) return; // Ngăn gửi nếu rỗng

    const reviewData = {
      review_contents: values.review_contents,
      parent_review_id: review._id, // Liên kết phản hồi với review gốc
    };

    if (entity.id === auth?.user?.id) {
      // Nếu entity.id khớp với user.id từ AuthContext
      reviewData.user_id = entity.id;
    } else if (
      entity.id === business?.business?.id &&
      business?.business?.id === businessId
    ) {
      // Nếu entity.id khớp với business.id từ BusinessContext
      reviewData.business_id_feedback = entity.id;
    } else if (
      entity.id === business?.business?.id &&
      business?.business?.id !== businessId
    ) {
      // Nếu không phải user hoặc business feedback, coi như business review
      reviewData.business_id_review = entity.id;
    }

    createReview(reviewData, {
      onSuccess: () => {
        form.resetFields(); // Reset form
        setIsShowReply(false); // Ẩn ô nhập
        // setIsShowListReply(true);
      },
      onError: (error) => {
        console.error("Lỗi khi gửi phản hồi:", error);
      },
    });
  };

  const replyInputRef = useRef(null);
  useEffect(() => {
    if (isShowReply && replyInputRef.current) {
      replyInputRef.current.focus();
    }
  }, [isShowReply]);
  return (
    <>
      <Row>
        <Col span={24} style={{ display: "flex" }}>
          <div style={{ margin: "7px 7px 0 0" }}>
            <Avatar
              src={
                !review.user_id && review.business_id_review
                  ? review.business_id_review.avatar
                  : review.user_id.avatar ||
                    "https://res.cloudinary.com/nienluan/image/upload/v1741015659/default-avatar-profile-icon-social-media-user-image-gray-avatar-icon-blank-profile-silhouette-illustration-vector_d3dgki.jpg"
              }
              size={32}
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
                <p style={{ fontWeight: "bold", margin: 0, fontSize: 13 }}>
                  {!review.user_id && review.business_id_review
                    ? review.business_id_review.business_name
                    : review.user_id.name}
                </p>
              </div>
              <div>
                <Rate
                  className="custom-rate"
                  value={review.review_rating}
                  disabled
                  style={{ fontSize: 15 }}
                />
              </div>
              <div>
                <p style={{ margin: 0, fontSize: 13 }}>
                  {isShowFullContent || !isLongContent
                    ? review.review_contents
                    : shortContent}
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
                      {isShowFullContent ? "Ẩn bớt" : "Xem thêm"}
                    </Button>
                  )}
                </p>
              </div>
            </div>

            <Row style={{ alignItems: "center", display: "flex", gap: 8 }}>
              <Typography.Text
                style={{ marginLeft: 7, color: "#6D6F71", fontSize: 12 }}
              >
                {formatTime(review.createdAt)}
              </Typography.Text>
              <div>
                <Button
                  type="link"
                  ghost
                  style={{
                    border: "none",
                    display: "flex",
                    boxShadow: "none",
                    padding: 0,
                    color: "#808080",
                    fontWeight: "bold",
                    gap: 0,
                  }}
                  onClick={() => handleAction(handleShowReply)}
                >
                  <p style={{ margin: "0px 0px 0px 3px", fontSize: 12 }}>
                    Phản hồi
                  </p>
                </Button>
              </div>
            </Row>
          </div>
        </Col>
      </Row>
      <Row>
        <Col span={3}></Col>
        <Col span={21}>
          <ReviewResponseList parentReviewId={review._id} />
        </Col>
      </Row>
      <Row>
        {isShowReply && entity?.id && (
          <Col span={24}>
            <Row>
              <Col span={3} style={{ marginTop: 7 }}>
                <Avatar size={32} src={entity.avatar}></Avatar>
              </Col>
              <Col span={20}>
                <div
                  style={{
                    backgroundColor: "#f0f2f5",
                    borderRadius: "10px",
                    padding: "4px",
                  }}
                >
                  <Form form={form} onFinish={handleReply}>
                    <Row>
                      <Col span={21}>
                        <Form.Item noStyle name={"review_contents"}>
                          <TextArea
                            ref={replyInputRef}
                            autoSize={{ minRows: 1, maxRows: 5 }}
                            variant="borderless"
                            placeholder={`Phản hồi cho ${
                              !review.user_id && review.business_id_review
                                ? review.business_id_review.business_name
                                : review.user_id.name
                            }`}
                            onPressEnter={(e) => {
                              e.preventDefault();
                              form.submit();
                            }}
                          />
                        </Form.Item>
                      </Col>
                      <Col span={3}>
                        <Form.Item noStyle>
                          <Button
                            type="text"
                            htmlType="submit"
                            loading={isLoading}
                          >
                            <SendOutlined
                              style={{ fontSize: "20px", color: "#1890ff" }}
                            />
                          </Button>
                        </Form.Item>
                      </Col>
                    </Row>
                  </Form>
                </div>
              </Col>
            </Row>
          </Col>
        )}
      </Row>
      <Row>
        <Col span={24}>
          <hr
            style={{
              height: "2px",
              border: "no",
              opacity: "0.2",
              marginTop: 6,
            }}
          />
        </Col>
      </Row>

      <LoginRequiredModal
        isModalOpen={isLoginRequiredModalOpen}
        handleCancel={handleCancel}
      />
    </>
  );
};

export default ReviewItem;
