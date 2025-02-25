import { Button, Col, Form, Input, Modal, Row, Typography } from "antd";

import useComment from "../../hooks/useComment";
import CommentList from "./CommentList";
import { SendOutlined } from "@ant-design/icons";

const CommentModal = ({ isModalOpen, setIsModalOpen, post_id }) => {
  const { commentData } = useComment(post_id);

  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
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
      onOk={handleOk}
      width={600}
      onCancel={handleCancel}
      footer={
        // <div style={{ textAlign: "center" }}>
        //   <Typography.Text type="secondary">Nhấn ESC để thoát</Typography.Text>
        // </div>
        <div>
          <Form>
            <Row>
              <Col span={20}>
                <Form.Item>
                  <Input.TextArea
                    placeholder="Bình luận về bài viết này"
                    autoSize={{ minRows: 2 }}
                    style={{ maxHeight: "150px", overflow: "auto" }}
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
                  <Button type="text" htmlType="submit">
                    <SendOutlined style={{ fontSize: "20px" }} />
                  </Button>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </div>
      }
    >
      <CommentList commentData={commentData} />
    </Modal>
  );
};

export default CommentModal;
