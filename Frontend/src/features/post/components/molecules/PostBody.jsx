import { Col, Row, Tag, Typography } from "antd";

const PostBody = ({ postData }) => {
  return (
    <div style={{ margin: "8px" }}>
      <Row>
        <Col span={24}>
          <Typography.Title style={{ margin: "8px 0px" }} level={4}>
            {postData?.title}
          </Typography.Title>
        </Col>
      </Row>
      <Row>
        <Col span={24} style={{ marginBottom: "8px" }}>
          {postData?.tags?.length > 0 &&
            postData.tags.map((tag) => (
              <Tag key={tag.tag_name} color="blue">
                #{tag.tag_name}
              </Tag>
            ))}
        </Col>
      </Row>
      <Row>
        <Col span={24}>{postData?.content}</Col>
      </Row>
    </div>
  );
};

export default PostBody;
