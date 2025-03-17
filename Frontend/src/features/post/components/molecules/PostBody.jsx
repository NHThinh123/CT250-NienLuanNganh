import { Col, Row, Tag, Typography } from "antd";
import PostLinkedBusiness from "./PostLinkedBusiness";
import { Link } from "react-router-dom";

const PostBody = ({ postData }) => {
  return (
    <div style={{ margin: "8px" }}>
      <Row>
        <Col span={24}>
          <Typography.Title style={{ margin: "8px 0px" }} level={4}>
            {postData?.title}
          </Typography.Title>
          {postData?.edited && (
            <Typography.Text type="secondary">(Đã chỉnh sửa)</Typography.Text>
          )}
        </Col>
      </Row>
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
      <Row>
        <Col span={24}>{postData?.content}</Col>
      </Row>
      {postData?.linked_business_id && (
        <div>
          <Typography.Text italic type="secondary">
            {" "}
            Thông tin quán ăn:
          </Typography.Text>
          <Link to={`/businesses/${postData.linked_business_id}`}>
            <PostLinkedBusiness linked_business={postData?.linked_business} />
          </Link>
        </div>
      )}
    </div>
  );
};

export default PostBody;
