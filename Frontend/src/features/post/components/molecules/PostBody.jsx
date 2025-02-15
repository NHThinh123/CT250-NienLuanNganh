import { Col, List, Row, Tag, Typography } from "antd";

const PostBody = ({ postData }) => {
  return (
    <div style={{ margin: "8px" }}>
      <Row>
        <Col span={24}>
          <Typography.Title level={4}>{postData?.title}</Typography.Title>
        </Col>
      </Row>
      <Row>
        <Col span={24}>
          {postData?.tags?.length > 0 && (
            <List
              dataSource={postData.tags}
              renderItem={(item) => (
                <List.Item style={{ padding: "0px", margin: "0px" }}>
                  <Tag color="blue">#{item.tag_name}</Tag>
                </List.Item>
              )}
            />
          )}
        </Col>
      </Row>
      <Row>
        <Col span={24}>{postData?.content}</Col>
      </Row>
    </div>
  );
};

export default PostBody;
