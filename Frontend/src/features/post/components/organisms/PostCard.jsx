import { Avatar, Col, Row, Space, Tag, Typography } from "antd";
import logo from "../../../../assets/logo/logo.png";
import BoxContainer from "../../../../components/atoms/BoxContainer";
import { HeartOutlined, MessageOutlined } from "@ant-design/icons";

const PostCard = ({ post }) => {
  return (
    <BoxContainer style={{ padding: "0px" }}>
      <Row>
        <Col span={10}>
          <img
            src={post.images[0].url ? post.images[0].url : logo}
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
                    "https://anhnail.com/wp-content/uploads/2024/11/Hinh-gai-xinh-2k4.jpg"
                  }
                  size={20}
                ></Avatar>
                <p>{post.user.name}</p>
              </Space>
            </div>
            <div>
              <Row style={{ marginTop: "16px" }} gutter={8}>
                <Col span={4}>
                  <HeartOutlined style={{ marginRight: "4px" }} />
                  <Typography.Text>{post.likeCount} Yêu thích</Typography.Text>
                </Col>
                <Col span={4}>
                  <MessageOutlined style={{ marginRight: "4px" }} />
                  <Typography.Text> Bình luận</Typography.Text>
                </Col>
              </Row>
            </div>
          </div>
        </Col>
      </Row>
    </BoxContainer>
  );
};

export default PostCard;
