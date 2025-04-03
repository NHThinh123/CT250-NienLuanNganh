import { useState, useEffect, useRef } from "react";
import { Col, List, Row } from "antd";

import Comment from "../organisms/Comment";

const CommentList = ({ commentData, post_id, minWidth, height, isPending }) => {
  const listRef = useRef(null); // Tạo ref để tham chiếu đến danh sách bình luận
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  // Theo dõi kích thước màn hình
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = 0; // Cuộn lên đầu khi commentData thay đổi
    }
  }, [commentData]); // Theo dõi sự thay đổi của commentData

  // Tính chiều cao responsive
  const responsiveHeight =
    height ||
    (windowWidth <= 576 ? "300px" : windowWidth <= 768 ? "340px" : "380px");

  if (isPending)
    return (
      <Row
        style={{
          height: responsiveHeight,
          padding: windowWidth <= 576 ? "0px 8px" : "0px 16px", // Responsive padding
          textAlign: "center",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <p
          style={{
            fontSize: windowWidth <= 576 ? "14px" : "16px", // Responsive font
            margin: 0,
          }}
        >
          Loading...
        </p>
      </Row>
    );

  if (commentData?.length < 1)
    return (
      <Row
        style={{
          height: responsiveHeight,
          padding: windowWidth <= 576 ? "0px 8px" : "0px 16px", // Responsive padding
          textAlign: "center",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
        justify="center"
      >
        <p
          style={{
            fontSize: windowWidth <= 576 ? "14px" : "16px", // Responsive font
            margin: 0,
          }}
        >
          Không có bình luận
        </p>
      </Row>
    );

  return (
    <Row
      style={{
        height: responsiveHeight,
        overflowY: "auto",
        scrollbarWidth: "thin",
        padding: windowWidth <= 576 ? "0px 4px" : "0px 8px", // Responsive padding
        margin: "0px",
      }}
    >
      <Col span={24}>
        <List
          ref={listRef}
          grid={{ gutter: 0, column: 1 }}
          split={false}
          style={{ padding: "0px", margin: "0px" }}
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
        />
      </Col>
    </Row>
  );
};

export default CommentList;
