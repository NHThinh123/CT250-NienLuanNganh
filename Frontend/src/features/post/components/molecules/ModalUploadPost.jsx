/* eslint-disable no-unused-vars */
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
import { Images, MapPinned, Tags } from "lucide-react";
import UploadImage from "../atoms/UploadImage";
import { useState } from "react";
import UploadTag from "../atoms/UploadTag";

const ModalUploadPost = ({ isModalOpen, handleCancel, handleOk }) => {
  const [isShowUploadImage, setIsShowUploadImage] = useState(false);
  const [isShowUploadTag, setIsShowUploadTag] = useState(false);
  const [isShowUploadLocation, setIsShowUploadLocation] = useState(false);
  const handleShowUploadImage = () => {
    setIsShowUploadImage(true);
  };
  const handleShowUploadTag = () => {
    setIsShowUploadTag(true);
  };
  const handleShowUploadLocation = () => {
    setIsShowUploadLocation(true);
  };
  return (
    <Modal
      title={
        <Typography.Title level={4} style={{ textAlign: "center" }}>
          Tạo bài viết
        </Typography.Title>
      }
      open={isModalOpen}
      onOk={handleOk}
      onCancel={() => {
        handleCancel();
        setIsShowUploadImage(false);
        setIsShowUploadTag(false);
        setIsShowUploadLocation(false);
      }}
      okText="Đăng tải"
      cancelText="Hủy"
      maskClosable={false}
      centered
      style={{ minWidth: "50%" }}
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
      <Row
        style={{
          marginTop: "16px",
          maxHeight: "320px",
          overflowY: "auto",
          padding: "8px",
          scrollbarWidth: "thin",
        }}
      >
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
                autoSize={{ minRows: 4, maxRows: 10 }}
              ></Input.TextArea>
            </Form.Item>
          </Form>
        </Col>
        {isShowUploadTag && (
          <Col span={24}>
            <UploadTag />
          </Col>
        )}
        {isShowUploadImage && (
          <Col span={24}>
            <UploadImage />
          </Col>
        )}
      </Row>

      <Row
        style={{
          border: "1px solid #000",
          borderRadius: "8px",
          padding: "8px",
          marginTop: "16px",
          textAlign: "center",
        }}
        align={"middle"}
      >
        <Col span={12}>
          <Typography.Text style={{ fontWeight: "bold", textAlign: "right" }}>
            Thêm vào bài viết của bạn:
          </Typography.Text>
        </Col>
        <Col span={4}>
          <Button
            type="text"
            style={{ padding: "4px 18px" }}
            onClick={handleShowUploadImage}
          >
            <Popover content="Thêm ảnh">
              <Images color="#03c200" size={24} strokeWidth={2.5} />
            </Popover>
          </Button>
        </Col>
        <Col span={4}>
          <Button
            type="text"
            style={{ padding: "4px 18px" }}
            onClick={handleShowUploadTag}
          >
            <Popover content="Thêm chủ đề">
              <Tags color="#e09c0b" size={24} strokeWidth={2.5} />
            </Popover>
          </Button>
        </Col>
        <Col span={4}>
          <Button
            type="text"
            style={{ padding: "4px 18px" }}
            onClick={handleShowUploadLocation}
          >
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
