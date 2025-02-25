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
import { useState, useEffect, useRef, useContext } from "react";
import { SendOutlined } from "@ant-design/icons";
import useComment from "../../hooks/useComment";
import useCreateComment from "../../hooks/useCreateComment";
import CommentList from "./CommentList";
import { AuthContext } from "../../../../contexts/auth.context";

const { TextArea } = Input;

const CommentModal = ({ isModalOpen, setIsModalOpen, post_id }) => {
  const { auth } = useContext(AuthContext);
  const [form] = Form.useForm();
  const { commentData } = useComment(post_id);
  const { mutate: createComment } = useCreateComment();
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef(null);

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
        user_id: auth?.user?.id,
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
        <Typography.Title level={4} style={{ textAlign: "center" }}>
          Bình luận
        </Typography.Title>
      }
      open={isModalOpen}
      onCancel={() => setIsModalOpen(false)}
      width={600}
      footer={
        <Form form={form} onFinish={handleSubmit}>
          <Row>
            <Col span={20}>
              <Form.Item name="comment_content">
                <TextArea
                  ref={inputRef}
                  placeholder="Bình luận về bài viết này"
                  autoSize={{ minRows: 1, maxRows: 5 }} // Mở rộng khi nhập dài
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown} // Xử lý Enter
                />
              </Form.Item>
            </Col>
            <Col
              span={4}
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Form.Item>
                <Button
                  type="text"
                  htmlType="submit"
                  disabled={!inputValue.trim()} // Disable khi input rỗng
                >
                  <SendOutlined
                    style={{
                      fontSize: "20px",
                      color: !inputValue.trim() ? "gray" : "#1890ff",
                    }}
                  />
                </Button>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      }
    >
      <CommentList commentData={commentData} />
    </Modal>
  );
};

export default CommentModal;
