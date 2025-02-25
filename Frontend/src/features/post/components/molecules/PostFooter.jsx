import {
  HeartFilled,
  MessageOutlined,
  ShareAltOutlined,
} from "@ant-design/icons";
import { Button, Col, Row, Typography } from "antd";
import { useContext, useState } from "react";
import useLikePost from "../../hooks/useLikePost";
import useUnlikePost from "../../hooks/useUnLikePost";
import { AuthContext } from "../../../../contexts/auth.context";

const PostFooter = ({ postData, showModal, commentCount }) => {
  const { auth } = useContext(AuthContext);
  const { mutate: likePost } = useLikePost();
  const { mutate: unlikePost } = useUnlikePost();

  const [isLiked, setIsLiked] = useState(postData?.isLike || false);
  const [likeCount, setLikeCount] = useState(postData?.likeCount || 0);

  const user_id = auth?.user?.id;

  const handleLike = () => {
    if (!isLiked) {
      likePost(
        {
          user_id: user_id,
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
          user_id: user_id,
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
  return (
    <>
      <Row style={{ textAlign: "center", marginTop: "16px" }}>
        <Col span={8}>
          <Button type="text" onClick={handleLike}>
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
    </>
  );
};

export default PostFooter;
