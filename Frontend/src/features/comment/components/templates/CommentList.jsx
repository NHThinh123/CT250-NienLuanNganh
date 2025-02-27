import { Col, List, Row } from "antd";
import Comment from "../organisms/Comment";

const CommentList = ({ commentData, post_id }) => {
  if (commentData?.length < 1)
    return (
      <Row
        style={{
          height: "380px",
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
        height: "380px",
        overflowY: "auto",
        scrollbarWidth: "thin",
        padding: "0px 16px",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        justifyContent: "flex-start",
      }}
    >
      <List
        split={false}
        dataSource={commentData}
        renderItem={(comment) => (
          <List.Item>
            <Row>
              <Col span={24}>
                <Comment commentData={comment} post_id={post_id} />
              </Col>
            </Row>
          </List.Item>
        )}
      ></List>
    </Row>
  );
};

export default CommentList;
