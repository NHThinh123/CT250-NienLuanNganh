/* eslint-disable no-unused-vars */
import { useState, useEffect, useRef } from "react";
import {
  CaretDownOutlined,
  CaretUpOutlined,
  CheckCircleFilled,
  HeartFilled,
  SendOutlined,
  EditOutlined,
  DeleteOutlined,
  EllipsisOutlined,
} from "@ant-design/icons";
import {
  Avatar,
  Button,
  Col,
  Form,
  message,
  Row,
  Typography,
  Dropdown,
  Menu,
} from "antd";
import useLikeComment from "../../hooks/useLikeComment";
import useUnlikeComment from "../../hooks/useUnlikeComment";
import useUpdateComment from "../../hooks/useUpdateComment";
import useDeleteComment from "../../hooks/useDeleteComment";
import LoginRequiredModal from "../../../../components/organisms/LoginRequiredModal";
import TextArea from "antd/es/input/TextArea";
import CommentList from "../templates/CommentList";
import useReplyComment from "../../hooks/useReplyComment";
import useCreateReply from "../../hooks/useCreateReply";
import { useAuthEntity } from "../../../../hooks/useAuthEntry";
import { Link } from "react-router-dom";
import { formatTime } from "../../../../constants/formatTime";

const Comment = ({ commentData, post_id, minWidth }) => {
  const { entity } = useAuthEntity();
  const [form] = Form.useForm();
  const [editForm] = Form.useForm();
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  const { mutate: createReply } = useCreateReply(commentData?._id);
  const { mutate: likeComment } = useLikeComment(post_id);
  const { mutate: unlikeComment } = useUnlikeComment(post_id);
  const { mutate: updateComment, isPending: isUpdating } =
    useUpdateComment(post_id);
  const { mutate: deleteComment, isPending: isDeleting } =
    useDeleteComment(post_id);

  const [isLoginRequiredModalOpen, setIsLoginRequiredModalOpen] =
    useState(false);
  const [isShowReply, setIsShowReply] = useState(false);
  const [isShowListReply, setIsShowListReply] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const { replyData, loading } = useReplyComment(
    commentData?._id,
    isShowListReply
  );

  const isOwner = entity?.id === commentData?.author?.id;

  // Theo dõi kích thước màn hình
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleShowReply = () => setIsShowReply(!isShowReply);
  const showLoginRequiredModal = () => setIsLoginRequiredModalOpen(true);
  const handleCancel = () => setIsLoginRequiredModalOpen(false);

  const handleAction = (action) => {
    if (!entity?.id) {
      showLoginRequiredModal();
    } else {
      action();
    }
  };

  const handleLike = () => {
    if (!commentData?.isLike) {
      likeComment({ id: entity.id, comment_id: commentData?._id });
    } else {
      unlikeComment({ id: entity.id, comment_id: commentData?._id });
    }
  };

  const handleReply = (values) => {
    if (!values.comment_content?.trim()) return;
    createReply(
      {
        id: entity.id,
        post_id: post_id,
        parent_comment_id: commentData?._id,
        comment_content: values.comment_content,
      },
      {
        onSuccess: () => {
          form.resetFields();
          setIsShowReply(false);
          setIsShowListReply(true);
        },
        onError: () => message.error("Error creating reply"),
      }
    );
  };

  const handleUpdate = (values) => {
    if (!values.comment_content?.trim()) return;
    updateComment(
      {
        comment_id: commentData?._id,
        comment_content: values.comment_content,
      },
      {
        onSuccess: () => {
          setIsEditing(false);
          editForm.resetFields();
        },
      }
    );
  };

  const handleDelete = () => {
    deleteComment(commentData?._id);
  };

  const replyInputRef = useRef(null);
  useEffect(() => {
    if (isShowReply && replyInputRef.current) {
      replyInputRef.current.focus();
    }
  }, [isShowReply]);

  const menu = (
    <Menu>
      <Menu.Item
        key="edit"
        onClick={() => handleAction(() => setIsEditing(true))}
      >
        <EditOutlined /> Sửa
      </Menu.Item>
      <Menu.Item key="delete" onClick={() => handleAction(handleDelete)}>
        <DeleteOutlined /> Xóa
      </Menu.Item>
    </Menu>
  );

  return (
    <Row
      style={{
        minWidth: minWidth || (windowWidth <= 576 ? "300px" : "380px"), // Responsive minWidth
        margin: 0,
        padding: windowWidth <= 576 ? "4px 0" : "8px 0", // Responsive padding
      }}
    >
      <Col style={{ marginRight: windowWidth <= 576 ? "6px" : "10px" }}>
        <Avatar
          size={windowWidth <= 576 ? "small" : "default"} // Responsive Avatar
          src={
            commentData?.author?.avatar ||
            "https://res.cloudinary.com/nienluan/image/upload/v1741015659/default-avatar-profile-icon-social-media-user-image-gray-avatar-icon-blank-profile-silhouette-illustration-vector_d3dgki.jpg"
          }
        />
      </Col>
      <Col style={{ maxWidth: windowWidth <= 576 ? "85%" : "89%" }}>
        <div
          style={{
            backgroundColor: "#f0f2f5",
            padding: windowWidth <= 576 ? "6px" : "10px", // Responsive padding
            borderRadius: "10px",
          }}
        >
          <Typography.Text
            strong
            style={{
              fontSize: windowWidth <= 576 ? "14px" : "16px", // Responsive font
            }}
          >
            {commentData?.author?.name}{" "}
            {commentData?.author?.isBusiness && (
              <Link
                style={{
                  fontSize: windowWidth <= 576 ? "12px" : "14px", // Responsive font
                  marginLeft: 8,
                }}
                to={`/businesses/${commentData?.author?.id}`}
              >
                <CheckCircleFilled /> - Quán ăn
              </Link>
            )}
          </Typography.Text>
          <br />
          {isEditing ? (
            <Form form={editForm} onFinish={handleUpdate}>
              <Form.Item
                name="comment_content"
                initialValue={commentData?.comment_content}
                rules={[
                  { required: true, message: "Please enter comment content" },
                ]}
              >
                <TextArea
                  autoSize={{ minRows: 1, maxRows: 5 }}
                  style={{
                    fontSize: windowWidth <= 576 ? "14px" : "16px", // Responsive font
                  }}
                />
              </Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={isUpdating}
                size={windowWidth <= 576 ? "small" : "middle"} // Responsive size
              >
                Lưu
              </Button>
              <Button
                onClick={() => setIsEditing(false)}
                style={{ marginLeft: 8 }}
                size={windowWidth <= 576 ? "small" : "middle"} // Responsive size
              >
                Hủy
              </Button>
            </Form>
          ) : (
            <Typography.Text
              style={{
                color: commentData?.deleted ? "#999" : "inherit",
                fontWeight: commentData?.deleted ? "lighter" : "normal",
                fontSize: windowWidth <= 576 ? "14px" : "16px", // Responsive font
              }}
            >
              {commentData?.comment_content}
              {commentData?.isEdited && !commentData?.deleted && (
                <span
                  style={{
                    fontSize: windowWidth <= 576 ? "10px" : "12px", // Responsive font
                    color: "gray",
                  }}
                >
                  {" "}
                  (đã chỉnh sửa)
                </span>
              )}
            </Typography.Text>
          )}
        </div>
        <div
          style={{
            display: "flex",
            gap: "4px",
            alignItems: "center",
            flexWrap: "wrap", // Cho phép xuống dòng trên mobile
          }}
        >
          <Typography.Text
            style={{
              padding: "0px",
              fontSize: windowWidth <= 576 ? "10px" : "12px", // Responsive font
              lineHeight: "1",
              color: "gray",
            }}
          >
            {formatTime(commentData?.createdAt)}
          </Typography.Text>
          <Button
            type="link"
            style={{
              padding: "0px",
              fontSize: windowWidth <= 576 ? "10px" : "12px", // Responsive font
              lineHeight: "1",
            }}
            onClick={() => handleAction(handleLike)}
          >
            <HeartFilled
              style={{
                fontSize: windowWidth <= 576 ? "10px" : "12px", // Responsive icon
                color: !commentData?.isLike ? "gray" : "#ff4d4f",
                marginRight: 4,
              }}
            />
            <p
              style={{
                color: !commentData?.isLike ? "gray" : "#ff4d4f",
                margin: 0,
              }}
            >
              {commentData?.likeCount} Yêu thích
            </p>
          </Button>
          <Button
            type="link"
            style={{
              padding: "0px",
              fontSize: windowWidth <= 576 ? "10px" : "12px", // Responsive font
            }}
            onClick={() => handleAction(handleShowReply)}
          >
            <p style={{ fontWeight: "bold", color: "gray", margin: 0 }}>
              Phản hồi
            </p>
          </Button>
        </div>
      </Col>
      <Col
        span={1}
        style={{
          textAlign: "right",
          marginLeft: windowWidth <= 576 ? 2 : 4, // Responsive margin
        }}
      >
        {isOwner && !commentData?.deleted && !isEditing && (
          <Dropdown overlay={menu} trigger={["hover"]}>
            <Button
              type="link"
              style={{
                padding: "0px",
                fontSize: windowWidth <= 576 ? "10px" : "12px",
              }}
            >
              <EllipsisOutlined
                style={{
                  fontSize: windowWidth <= 576 ? "14px" : "18px", // Responsive icon
                  color: "#555",
                }}
              />
            </Button>
          </Dropdown>
        )}
      </Col>

      {commentData?.replyCount > 0 && (
        <Col
          span={24}
          style={{ marginBottom: windowWidth <= 576 ? "2px" : "4px" }}
        >
          <Row>
            <Col span={windowWidth <= 576 ? 3 : 2}></Col>
            <Col span={windowWidth <= 576 ? 21 : 22}>
              <Button
                type="link"
                style={{
                  padding: "0px",
                  fontSize: windowWidth <= 576 ? "10px" : "12px", // Responsive font
                }}
                onClick={() => setIsShowListReply(!isShowListReply)}
              >
                {!isShowListReply ? (
                  <p>
                    <CaretDownOutlined /> Xem {commentData.replyCount} phản hồi
                  </p>
                ) : (
                  <p>
                    <CaretUpOutlined /> Ẩn {commentData.replyCount} phản hồi
                  </p>
                )}
              </Button>
            </Col>
          </Row>
        </Col>
      )}
      {isShowListReply && (
        <Col span={24}>
          {loading ? (
            <Typography.Text
              style={{ fontSize: windowWidth <= 576 ? "12px" : "14px" }}
            >
              đang tải phản hồi
            </Typography.Text>
          ) : (
            <Row>
              <Col span={windowWidth <= 576 ? 3 : 2}></Col>
              <Col span={windowWidth <= 576 ? 21 : 22}>
                <CommentList
                  commentData={replyData}
                  post_id={post_id}
                  height="auto"
                  minWidth={windowWidth <= 576 ? 80 : 100} // Responsive minWidth
                />
              </Col>
            </Row>
          )}
        </Col>
      )}
      {isShowReply && entity.id && (
        <Col span={24}>
          <Row>
            <Col span={windowWidth <= 576 ? 2 : 1}></Col>
            <Col
              span={windowWidth <= 576 ? 2 : 2}
              style={{ textAlign: "center" }}
            >
              <Avatar
                size={windowWidth <= 576 ? "small" : "default"} // Responsive Avatar
                src={entity.avatar}
              />
            </Col>
            <Col span={windowWidth <= 576 ? 20 : 21}>
              <div
                style={{
                  backgroundColor: "#f0f2f5",
                  borderRadius: "10px",
                  padding: windowWidth <= 576 ? "2px" : "4px", // Responsive padding
                }}
              >
                <Form form={form} onFinish={handleReply}>
                  <Row>
                    <Col span={windowWidth <= 576 ? 20 : 21}>
                      <Form.Item noStyle name="comment_content">
                        <TextArea
                          ref={replyInputRef}
                          autoSize={{ minRows: 1, maxRows: 5 }}
                          variant="borderless"
                          placeholder={`Phản hồi cho ${commentData?.author?.name}`}
                          onPressEnter={(e) => {
                            e.preventDefault();
                            form.submit();
                          }}
                          style={{
                            fontSize: windowWidth <= 576 ? "12px" : "14px", // Responsive font
                          }}
                        />
                      </Form.Item>
                    </Col>
                    <Col span={windowWidth <= 576 ? 4 : 3}>
                      <Form.Item noStyle>
                        <Button
                          type="text"
                          htmlType="submit"
                          size={windowWidth <= 576 ? "small" : "middle"} // Responsive size
                        >
                          <SendOutlined
                            style={{
                              fontSize: windowWidth <= 576 ? "14px" : "20px", // Responsive icon
                              color: "#1890ff",
                            }}
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

      <LoginRequiredModal
        isModalOpen={isLoginRequiredModalOpen}
        handleCancel={handleCancel}
      />
    </Row>
  );
};

export default Comment;
