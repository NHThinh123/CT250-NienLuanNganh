import {
  Avatar,
  Button,
  Col,
  Form,
  Input,
  Modal,
  Popover,
  Row,
  Typography,
  Upload,
} from "antd";
import { ImageUp, MapPinned, Tags } from "lucide-react";

const ModalUploadPost = ({ isModalOpen, handleCancel, handleOk }) => {
  return (
    <Modal
      title={
        <Typography.Title level={4} style={{ textAlign: "center" }}>
          Tạo bài viết
        </Typography.Title>
      }
      open={isModalOpen}
      onOk={handleOk}
      onCancel={handleCancel}
      okText="Đăng tải"
      cancelText="Hủy"
      maskClosable={false}
    >
      <Row>
        <Col span={2}>
          <Avatar
            src={
              "https://anhnail.com/wp-content/uploads/2024/11/Hinh-gai-xinh-2k4.jpg"
            }
          ></Avatar>
        </Col>
        <Col span={20}>
          <Typography.Text style={{ fontWeight: "bold" }}>
            Thịnh KAFF
          </Typography.Text>
        </Col>
      </Row>
      <Row style={{ marginTop: "16px", maxHeight: "280px", overflowY: "auto" }}>
        <Col span={24}>
          <Form>
            <Form.Item
              name="title"
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập tiêu đề bài viết!",
                },
              ]}
            >
              <Input size="large" placeholder="Nhập tiêu đề bài viết"></Input>
            </Form.Item>
            <Form.Item
              name="content"
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập tiêu nội dung viết!",
                },
              ]}
            >
              <Input.TextArea
                size="large"
                placeholder="Hãy viết về trải nghiệm ẩm thực của bạn hôm nay!"
                autoSize={{ minRows: 3, maxRows: 10 }}
              ></Input.TextArea>
            </Form.Item>
          </Form>
        </Col>
        <Col span={24}>
          <Form.Item>
            <Upload.Dragger name="files" multiple={true}>
              <ImageUp />
              <br />
              <Typography.Text>Thêm ảnh/video</Typography.Text>
            </Upload.Dragger>
          </Form.Item>
        </Col>
      </Row>

      <Row
        style={{
          border: "1px solid #000",
          borderRadius: "8px",
          padding: "8px",

          textAlign: "center",
        }}
        align={"middle"}
      >
        <Col span={12}>
          <Typography.Text style={{ fontWeight: "bold", textAlign: "right" }}>
            Thêm vào bài viết của bạn:
          </Typography.Text>
        </Col>

        <Col span={6}>
          <Button type="text" style={{ padding: "4px 18px" }}>
            <Popover content="Thêm chủ đề">
              <Tags color="#e09c0b" size={24} strokeWidth={2.5} />
            </Popover>
          </Button>
        </Col>
        <Col span={6}>
          <Button type="text" style={{ padding: "4px 18px" }}>
            <Popover content="Thêm địa điểm">
              <MapPinned color="#ff4d4f" size={24} strokeWidth={2.5} />
            </Popover>
          </Button>
        </Col>
      </Row>
    </Modal>
  );
};

export default ModalUploadPost;
