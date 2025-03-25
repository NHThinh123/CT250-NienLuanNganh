// ReviewItem.jsx không cần thay đổi lớn, giữ nguyên code hiện tại
import { Avatar, Rate, Typography, Row, Col, Button, Form } from "antd";
import { SendOutlined } from "@ant-design/icons";
import TextArea from "antd/es/input/TextArea";
import ReviewResponseList from "../molecules/ReviewResponseList";
import ReviewMedia from "../molecules/ReviewMedia";
import "../../../../styles/global.css";
import LoginRequiredModal from "../../../../components/organisms/LoginRequiredModal";
import { useAuthEntity } from "../../../../hooks/useAuthEntry";
import { useContext, useEffect, useRef, useState } from "react";
import { formatTime } from "../../../../constants/formatTime";
import useCreateReview from "../../hooks/useCreateReview";
import { AuthContext } from "../../../../contexts/auth.context";
import { BusinessContext } from "../../../../contexts/business.context";
import useAssetReviewByReviewId from "../../hooks/useAssetReviewByReviewId";

const ReviewItem = ({ review, businessId }) => {
  const { assetReviewData } = useAssetReviewByReviewId(review._id) || null;
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

  const replyContainerRef = useRef(null);

  useEffect(() => {
    setIsShowReply(false);
  }, [review._id]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isShowReply &&
        replyContainerRef.current &&
        !replyContainerRef.current.contains(event.target)
      ) {
        setIsShowReply(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isShowReply]);

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
    if (!values.review_contents?.trim()) return;

    const reviewData = {
      review_contents: values.review_contents,
      parent_review_id: review._id,
    };

    if (entity.id === auth?.user?.id) {
      reviewData.user_id = entity.id;
    } else if (
      entity.id === business?.business?.id &&
      business?.business?.id === businessId
    ) {
      reviewData.business_id_feedback = entity.id;
    } else if (
      entity.id === business?.business?.id &&
      business?.business?.id !== businessId
    ) {
      reviewData.business_id_review = entity.id;
    }

    createReview(reviewData, {
      onSuccess: () => {
        form.resetFields();
        setIsShowReply(false);
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
                      {isShowFullContent ? "Thu gọn" : "Xem thêm"}
                    </Button>
                  )}
                </p>
              </div>
            </div>
            <Row>
              <ReviewMedia assetReviewData={assetReviewData} />
            </Row>

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
      <div ref={replyContainerRef}>
        {isShowReply && entity?.id && (
          <div style={{ display: "flex", width: "100%" }}>
            <div style={{ margin: "4px 7px 0 0" }}>
              <Avatar size={32} src={entity.avatar}></Avatar>
            </div>
            <Form form={form} onFinish={handleReply} style={{ flex: 1 }}>
              <div
                style={{
                  backgroundColor: "#f0f2f5",
                  borderRadius: "10px",
                  padding: "3px",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <div style={{ flex: 1 }}>
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
                      style={{ width: "100%" }}
                    />
                  </Form.Item>
                </div>
                <div>
                  <Form.Item noStyle>
                    <Button type="text" htmlType="submit" loading={isLoading}>
                      <SendOutlined
                        style={{ fontSize: "20px", color: "#1890ff" }}
                      />
                    </Button>
                  </Form.Item>
                </div>
              </div>
            </Form>
          </div>
        )}
      </div>

      <LoginRequiredModal
        isModalOpen={isLoginRequiredModalOpen}
        handleCancel={handleCancel}
      />
    </>
  );
};

export default ReviewItem;
