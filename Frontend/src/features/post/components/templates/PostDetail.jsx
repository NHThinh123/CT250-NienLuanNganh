import { Avatar, Col, Divider, Row, Typography } from "antd";
import BoxContainer from "../../../../components/atoms/BoxContainer";
import PostImages from "../molecules/PostImages";
import PostFooter from "../molecules/PostFooter";
import { useState } from "react";
import CommentModal from "../../../comment/components/templates/CommentModal";

const PostDetail = ({ postData, isLoading, isError }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = () => {
    setIsModalOpen(true);
  };
  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error</div>;
  return (
    <Row justify={"center"}>
      <Col span={16}>
        <BoxContainer style={{ padding: "20px" }}>
          <Row align={"middle"}>
            <Col style={{ marginRight: "10px" }}>
              <Avatar src={postData?.user?.avatar} size={"large"}></Avatar>
            </Col>
            <Col span={20}>
              <Typography.Title level={4}>
                {postData?.user?.name}
              </Typography.Title>
            </Col>
          </Row>
          <Divider />
          <Typography.Title level={2}>{postData?.title}</Typography.Title>
          <p style={{ fontSize: 18, marginBottom: "16px" }}>
            {postData?.content}
          </p>
          <PostImages imagesData={postData?.images}></PostImages>
          <PostFooter
            postData={postData}
            showModal={showModal}
            commentCount={postData?.commentCount}
          ></PostFooter>
          <CommentModal
            post_id={postData?._id}
            isModalOpen={isModalOpen}
            setIsModalOpen={setIsModalOpen}
          ></CommentModal>
        </BoxContainer>
      </Col>
    </Row>
  );
};

export default PostDetail;
