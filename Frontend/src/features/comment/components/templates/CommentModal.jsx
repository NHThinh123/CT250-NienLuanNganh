import { useState, useEffect, useRef } from "react";
import {
  Button,
  Col,
  Form,
  Input,
  message,
  Modal,
  Row,
  Typography,
} from "antd";
import { SendOutlined } from "@ant-design/icons";
import useComment from "../../hooks/useComment";
import useCreateComment from "../../hooks/useCreateComment";
import CommentList from "./CommentList";
import { useAuthEntity } from "../../../../hooks/useAuthEntry";

const { TextArea } = Input;

const CommentModal = ({ isModalOpen, setIsModalOpen, post_id }) => {
  const { entity } = useAuthEntity();
  const [form] = Form.useForm();
  const { commentData } = useComment(post_id, isModalOpen);
  const { mutate: createComment, isPending } = useCreateComment();
  const [inputValue, setInputValue] = useState("");
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const inputRef = useRef(null);

  // Theo dõi kích thước màn hình
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Focus vào input khi mở modal
  useEffect(() => {
    if (isModalOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isModalOpen]);

  // Gửi comment
  const handleSubmit = () => {
    if (!inputValue.trim()) return;
    createComment(
      {
        post_id: post_id,
        id: entity?.id,
        comment_content: inputValue,
      },
      {
        onSuccess: () => {
          form.resetFields();
          setInputValue(""); // Reset input
        },
        onError: () => {
          message.error("Error creating comment");
        },
      }
    );
  };

  // Xử lý sự kiện khi nhấn Enter
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault(); // Ngăn xuống dòng
      handleSubmit(); // Gửi comment
    }
  };

  return (
    <Modal
      centered
      title={
        <Typography.Title
          level={4}
          style={{
            textAlign: "center",
            fontSize:
              windowWidth <= 576
                ? "16px"
                : windowWidth <= 768
                ? "18px"
                : "20px", // Responsive font
            margin: 0,
          }}
        >
          Bình luận
        </Typography.Title>
      }
      open={isModalOpen}
      onCancel={() => setIsModalOpen(false)}
      width={windowWidth <= 576 ? "90%" : windowWidth <= 768 ? "80%" : 700} // Responsive width
      footer={
        entity?.id ? (
          <Form form={form} onFinish={handleSubmit}>
            <Row gutter={[8, 8]} align="middle">
              {" "}
              {/* Thêm gutter */}
              <Col
                xs={20} // Mobile: 20/24
                sm={21} // Tablet: 21/24
                md={20} // Desktop: 20/24
              >
                <Form.Item name="comment_content" style={{ marginBottom: 0 }}>
                  <TextArea
                    ref={inputRef}
                    placeholder="Bình luận về bài viết này"
                    autoSize={{ minRows: 1, maxRows: 5 }} // Mở rộng khi nhập dài
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    style={{
                      fontSize: windowWidth <= 576 ? "14px" : "16px", // Responsive font
                    }}
                  />
                </Form.Item>
              </Col>
              <Col
                xs={4} // Mobile: 4/24
                sm={3} // Tablet: 3/24
                md={4} // Desktop: 4/24
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Form.Item style={{ marginBottom: 0 }}>
                  <Button
                    type="text"
                    htmlType="submit"
                    disabled={!inputValue.trim()}
                    size={windowWidth <= 576 ? "middle" : "large"} // Responsive size
                  >
                    <SendOutlined
                      style={{
                        fontSize: windowWidth <= 576 ? "16px" : "20px", // Responsive icon
                        color: !inputValue.trim() ? "gray" : "#1890ff",
                      }}
                    />
                  </Button>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        ) : (
          <Typography.Text
            style={{
              textAlign: "center",
              width: "100%",
              display: "block",
              fontSize: windowWidth <= 576 ? "14px" : "16px", // Responsive font
            }}
          >
            Vui lòng đăng nhập để bình luận
          </Typography.Text>
        )
      }
    >
      <CommentList
        isPending={isPending}
        commentData={commentData}
        post_id={post_id}
      />
    </Modal>
  );
};

export default CommentModal;
