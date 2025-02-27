import { HeartFilled } from "@ant-design/icons";
import { Avatar, Button, Col, Form, Input, Row, Typography } from "antd";
import useLikeComment from "../../hooks/useLikeComment";
import useUnlikeComment from "../../hooks/useUnlikeComment";
import { useContext, useState } from "react";
import { AuthContext } from "../../../../contexts/auth.context";
import LoginRequiredModal from "../../../../components/organisms/LoginRequiredModal";

const Comment = ({ commentData, post_id }) => {
  const { auth } = useContext(AuthContext);

  const user_id = auth?.user?.id;
  const { mutate: likeComment } = useLikeComment(post_id);
  const { mutate: unlikeComment } = useUnlikeComment(post_id);
  const [isLoginRequiredModalOpen, setIsLoginRequiredModalOpen] =
    useState(false);

  const showLoginRequiredModal = () => {
    setIsLoginRequiredModalOpen(true);
  };

  const handleCancel = () => {
    setIsLoginRequiredModalOpen(false);
  };
  // Hành động được bảo vệ (yêu cầu đăng nhập)
  const handleAction = (action) => {
    if (!user_id) {
      showLoginRequiredModal();
    } else {
      action();
    }
  };
  const handleLike = () => {
    if (!commentData?.isLike)
      likeComment({
        user_id: user_id,
        comment_id: commentData?._id,
      });
    else
      unlikeComment({
        user_id: user_id,
        comment_id: commentData?._id,
      });
  };

  return (
    <Row>
      <Col span={2}>
        <Avatar src={commentData?.user_id?.avatar}></Avatar>
      </Col>
      <Col span={22}>
        <div
          style={{
            backgroundColor: "#f0f2f5",
            padding: "10px",
            borderRadius: "10px",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Typography.Text strong>{commentData?.user_id?.name}</Typography.Text>
          <br />
          <Typography.Text>{commentData?.comment_content}</Typography.Text>
        </div>
        <div style={{ display: "flex", gap: "4px" }}>
          <Button
            type="link"
            style={{ padding: "0px 4px", fontSize: "12px" }}
            onClick={() => handleAction(handleLike)}
          >
            <HeartFilled
              style={{ color: !commentData?.isLike ? "gray" : "#ff4d4f" }}
            />
            <p style={{ color: !commentData?.isLike ? "gray" : "#ff4d4f" }}>
              {commentData?.likeCount} Yêu thích
            </p>
          </Button>
          <Button type="link" style={{ padding: "0px 4px", fontSize: "12px" }}>
            <p style={{ fontWeight: "bold", color: "gray" }}>Phản hồi</p>
          </Button>
        </div>
        {/* phần phản hồi */}
        <div style={{ display: "flex", gap: "16px" }}>
          <div style={{ textAlign: "center" }}>
            <Avatar size={"small"} src={commentData?.user_id?.avatar}></Avatar>
          </div>
          <div>
            <Form>
              <Form.Item noStyle>
                <Input />
              </Form.Item>
            </Form>
          </div>
        </div>
      </Col>
      <LoginRequiredModal
        isModalOpen={isLoginRequiredModalOpen}
        handleCancel={handleCancel}
      />
    </Row>
  );
};

export default Comment;
