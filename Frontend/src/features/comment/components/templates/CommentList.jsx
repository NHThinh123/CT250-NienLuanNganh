import { Col, List, Row } from "antd";
import Comment from "../organisms/Comment";

const CommentList = ({ commentData }) => {
  return (
    <Row style={{ maxHeight: "380px", overflowY: "auto" }}>
      <List
        split={false}
        dataSource={commentData}
        renderItem={(comment) => (
          <List.Item>
            <Row>
              <Col span={24}>
                <Comment commentData={comment} />
              </Col>
            </Row>
          </List.Item>
        )}
      ></List>
    </Row>
  );
};

export default CommentList;
