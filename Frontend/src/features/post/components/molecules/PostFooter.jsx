import {
  HeartFilled,
  MessageOutlined,
  ShareAltOutlined,
} from "@ant-design/icons";
import { Button, Col, Row, Typography } from "antd";
import { useEffect, useState } from "react";
import useLikePost from "../../hooks/useLikePost";
import useUnlikePost from "../../hooks/useUnLikePost";

import LoginRequiredModal from "../../../../components/organisms/LoginRequiredModal";
import { useAuthEntity } from "../../../../hooks/useAuthEntry";

const PostFooter = ({ postData, showModal, commentCount }) => {
  const { entity } = useAuthEntity();
  const { mutate: likePost } = useLikePost();
  const { mutate: unlikePost } = useUnlikePost();

  const [isLiked, setIsLiked] = useState(postData?.isLike || false);
  const [likeCount, setLikeCount] = useState(postData?.likeCount || 0);
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
    if (!entity?.id) {
      showLoginRequiredModal();
    } else {
      action();
    }
  };
  const handleLike = () => {
    if (!isLiked) {
      likePost(
        {
          id: entity.id,
          post_id: postData._id,
        },
        {
          onSuccess: () => {
            setIsLiked(true);
            setLikeCount((prev) => prev + 1);
          },
          onError: () => {
            console.log("like error");
          },
        }
      );
    } else {
      unlikePost(
        {
          id: entity.id,
          post_id: postData._id,
        },
        {
          onSuccess: () => {
            setIsLiked(false);
            setLikeCount((prev) => prev - 1);
          },
          onError: () => {
            console.log("unlike error");
          },
        }
      );
    }
  };
  useEffect(() => {
    setIsLiked(postData?.isLike || false);
    setLikeCount(postData?.likeCount || 0);
  }, [postData]); // Khi postData thay đổi, state sẽ được cập nhật lại
  return (
    <>
      <Row style={{ textAlign: "center", marginTop: "16px" }}>
        <Col span={8}>
          <Button type="text" onClick={() => handleAction(handleLike)}>
            <HeartFilled style={{ color: isLiked ? "#ff4d4f" : "gray" }} />
            <Typography.Text style={{ color: isLiked ? "#ff4d4f" : "black" }}>
              {likeCount} Yêu thích
            </Typography.Text>
          </Button>
        </Col>
        <Col span={8}>
          <Button type="text" onClick={showModal}>
            <MessageOutlined />
            <Typography.Text> {commentCount} Bình luận</Typography.Text>
          </Button>
        </Col>
        <Col span={8}>
          <Button type="text">
            <ShareAltOutlined />
            <Typography.Text>Chia sẻ</Typography.Text>
          </Button>
        </Col>
      </Row>
      <LoginRequiredModal
        isModalOpen={isLoginRequiredModalOpen}
        handleCancel={handleCancel}
      />
    </>
  );
};

export default PostFooter;
