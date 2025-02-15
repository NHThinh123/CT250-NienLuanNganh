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
} from "antd";
import { ChefHat, Images, MapPinned, Tags, Utensils } from "lucide-react";
import BoxContainer from "../../../../components/atoms/BoxContainer";
import { useState } from "react";

const UpLoadPostContainer = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  return (
    <BoxContainer>
      <Row>
        <Col span={4}>
          <Avatar
            src={
              "https://anhnail.com/wp-content/uploads/2024/11/Hinh-gai-xinh-2k4.jpg"
            }
          ></Avatar>
        </Col>
        <Col span={20}>
          <Button type="default" style={{ width: "100%" }} onClick={showModal}>
            Đăng tải bài viết
          </Button>
        </Col>
      </Row>
      <Row
        justify={"center"}
        style={{ textAlign: "center", marginTop: "8px" }}
        gutter={[16, 16]}
      >
        <Col span={12}>
          <Button type="default" style={{ width: "100%", color: "#03c200" }}>
            <Utensils size={18} color="#03c200" strokeWidth={2.5} />
            Món ngon
          </Button>
        </Col>
        <Col span={12}>
          <Button type="default" style={{ width: "100%", color: "#ff4d4f" }}>
            <ChefHat size={18} color="#ff4d4f" strokeWidth={2.5} /> Quán xịn
          </Button>
        </Col>
      </Row>

      <Modal
        title={
          <Typography.Title level={4} style={{ textAlign: "center" }}>
            Tạo bài viết
          </Typography.Title>
        }
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
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
        <Row style={{ marginTop: "16px" }}>
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
                  autoSize={{ minRows: 3, maxRows: 8 }}
                ></Input.TextArea>
              </Form.Item>
            </Form>
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
              Thêm vào bài viết của bạn
            </Typography.Text>
          </Col>
          <Col span={4}>
            <Button type="text" style={{ padding: "4px 18px" }}>
              <Popover content="Thêm ảnh">
                <Images size={24} color="#03c200" strokeWidth={2.5} />
              </Popover>
            </Button>
          </Col>
          <Col span={4}>
            <Button type="text" style={{ padding: "4px 18px" }}>
              <Popover content="Thêm chủ đề">
                <Tags color="#e09c0b" size={24} strokeWidth={2.5} />
              </Popover>
            </Button>
          </Col>
          <Col span={4}>
            <Button type="text" style={{ padding: "4px 18px" }}>
              <Popover content="Thêm địa điểm">
                <MapPinned color="#ff4d4f" size={24} strokeWidth={2.5} />
              </Popover>
            </Button>
          </Col>
        </Row>
      </Modal>
    </BoxContainer>
  );
};

export default UpLoadPostContainer;
