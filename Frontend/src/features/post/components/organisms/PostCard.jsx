import { Avatar, Col, Row, Space, Tag, Typography } from "antd";
import logo from "../../../../assets/logo/logo.png";
import BoxContainer from "../../../../components/atoms/BoxContainer";
import { HeartOutlined, MessageOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";

const PostCard = ({ post }) => {
  return (
    <Link
      to={`/posts/${post._id}`}
      style={{ textDecoration: "none", color: "inherit" }}
    >
      <BoxContainer style={{ padding: "0px" }}>
        <Row>
          <Col
            span={10}
            style={{
              maxWidth: 400,
              maxHeight: 250,
              overflow: "hidden",
              marginRight: "32px",
            }}
          >
            <img
              src={post.images[0]?.url ? post.images[0].url : logo}
              alt=""
              style={{ maxWidth: 400 }}
            />
          </Col>
          <Col span={14}>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <div>
                <h1>{post.title}</h1>
                <Col span={24}>
                  {post?.tags?.length > 0 &&
                    post.tags.map((tag) => (
                      <Tag key={tag.tag_name} color="blue">
                        #{tag.tag_name}
                      </Tag>
                    ))}
                </Col>
                <p>{post.content}</p>
              </div>

              <div style={{ marginTop: "8px" }}>
                <Space>
                  <Avatar
                    src={
                      post?.author?.avatar ||
                      "https://res.cloudinary.com/nienluan/image/upload/v1741015659/default-avatar-profile-icon-social-media-user-image-gray-avatar-icon-blank-profile-silhouette-illustration-vector_d3dgki.jpg"
                    }
                    size={20}
                  ></Avatar>
                  <p>{post.author?.name}</p>
                </Space>
              </div>
              <div>
                <Row style={{ marginTop: "16px" }} gutter={8}>
                  <Col span={4}>
                    <HeartOutlined style={{ marginRight: "4px" }} />
                    <Typography.Text>
                      {post.likeCount} Yêu thích
                    </Typography.Text>
                  </Col>
                  <Col span={4}>
                    <MessageOutlined style={{ marginRight: "4px" }} />
                    <Typography.Text>
                      {post.commentCount} Bình luận
                    </Typography.Text>
                  </Col>
                </Row>
              </div>
            </div>
          </Col>
        </Row>
      </BoxContainer>
    </Link>
  );
};

export default PostCard;
