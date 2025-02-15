import {
  HeartFilled,
  MessageOutlined,
  ShareAltOutlined,
} from "@ant-design/icons";
import { Button, Col, Row, Typography } from "antd";
import { useState } from "react";
import useLikePost from "../../hooks/useLikePost";

const PostFooter = ({ postData }) => {
  const { mutate: likePost } = useLikePost();

  const [isLiked, setIsLiked] = useState(postData?.isLike || false);

  const handleLike = () => {
    likePost(
      {
        user_id: "678b2f5ffc88df85ce348612",
        post_id: postData._id,
      },
      {
        onSuccess: () => {
          setIsLiked((prev) => !prev); // Đảo ngược trạng thái like
        },
        onError: () => {
          console.log("like error");
        },
      }
    );
  };
  return (
    <>
      <Row style={{ textAlign: "center", marginTop: "16px" }}>
        <Col span={8}>
          <Button type="text" onClick={handleLike}>
            <HeartFilled style={{ color: isLiked ? "#ff4d4f" : "gray" }} />
            <Typography.Text style={{ color: isLiked ? "#ff4d4f" : "black" }}>
              Yêu thích
            </Typography.Text>
          </Button>
        </Col>
        <Col span={8}>
          <Button type="text">
            <MessageOutlined />
            <Typography.Text> Bình luận</Typography.Text>
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
