import { Col, List, Row } from "antd";
import Comment from "../organisms/Comment";
import { useEffect, useRef } from "react";

const CommentList = ({ commentData, post_id, minWidth, height, isPending }) => {
  const listRef = useRef(null); // Tạo ref để tham chiếu đến danh sách bình luận

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = 0; // Cuộn lên đầu khi commentData thay đổi
    }
  }, [commentData]); // Theo dõi sự thay đổi của commentData

  if (isPending)
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
        <p>Loading...</p>
      </Row>
    );
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
