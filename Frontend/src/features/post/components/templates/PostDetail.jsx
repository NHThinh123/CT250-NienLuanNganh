import { Avatar, Col, Divider, Row, Tag, Typography } from "antd";
import BoxContainer from "../../../../components/atoms/BoxContainer";

import PostFooter from "../molecules/PostFooter";
import { useState } from "react";
import CommentModal from "../../../comment/components/templates/CommentModal";
import { formatTime } from "../../../../constants/formatTime";
import { Link } from "react-router-dom";
import { CheckCircleFilled } from "@ant-design/icons";
import PostMedia from "../molecules/PostMedia";
import PostLinkedBusiness from "../molecules/PostLinkedBusiness";

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
              <Avatar
                src={
                  postData?.author?.avatar ||
                  "https://res.cloudinary.com/nienluan/image/upload/v1741015659/default-avatar-profile-icon-social-media-user-image-gray-avatar-icon-blank-profile-silhouette-illustration-vector_d3dgki.jpg"
                }
                size={"large"}
              ></Avatar>
            </Col>
            <Col span={20}>
              <Typography.Title level={4} style={{ marginBottom: 0 }}>
                {postData?.author?.name}
                {postData?.business_id && (
                  <Link
                    style={{ fontSize: 14, marginLeft: 8 }}
                    to={`/businesses/${postData?.author?.id}`}
                  >
                    <CheckCircleFilled /> - Quán ăn
                  </Link>
                )}
              </Typography.Title>
              <Typography.Text>
                {formatTime(postData?.createdAt)}
              </Typography.Text>
            </Col>
          </Row>
          <Divider />
          <Typography.Title level={2}>{postData?.title}</Typography.Title>
          <Row>
            <Col span={24} style={{ marginBottom: "8px" }}>
              {postData?.tags?.length > 0 &&
                postData.tags.map((tag) => (
                  <Tag key={tag.tag_name} color="blue">
                    {tag.tag_name}
                  </Tag>
                ))}
            </Col>
          </Row>
          <p style={{ fontSize: 18, marginBottom: "16px" }}>
            {postData?.content}
          </p>
          {postData?.linked_business_id && (
            <div>
              <Typography.Text italic type="secondary">
                {" "}
                Thông tin quán ăn:
              </Typography.Text>
              <Link to={`/businesses/${postData.linked_business_id}`}>
                <PostLinkedBusiness
                  linked_business={postData?.linked_business}
                />
              </Link>
            </div>
          )}
          <PostMedia mediaData={postData?.media}></PostMedia>
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
