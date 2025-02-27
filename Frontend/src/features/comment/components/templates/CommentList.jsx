import { Col, List, Row } from "antd";
import Comment from "../organisms/Comment";

const CommentList = ({ commentData, post_id, minWidth, height }) => {
  if (commentData?.length < 1)
    return (
      <Row
        style={{
          height: height || "380px",
          padding: "0px 16px",
          textAlign: "center",
        }}
        justify={"center"}
        align={"middle"}
      >
        <p>Không có bình luận</p>
      </Row>
    );
  return (
    <Row
      style={{
        height: height || "380px",
        overflowY: "auto",
        scrollbarWidth: "thin",
        padding: "0px 8px",
      }}
    >
      <Col span={24}>
        <List
          grid={{ gutter: 16, column: 1 }}
          split={false}
          dataSource={commentData}
          renderItem={(comment) => (
            <List.Item>
              <Row>
                <Col span={24}>
                  <Comment
                    commentData={comment}
                    post_id={post_id}
                    minWidth={minWidth}
                  />
                </Col>
              </Row>
            </List.Item>
          )}
        ></List>
      </Col>
    </Row>
  );
};

export default CommentList;
