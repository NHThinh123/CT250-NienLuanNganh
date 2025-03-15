import {
  Avatar,
  Button,
  Col,
  Form,
  Input,
  message,
  Modal,
  Popover,
  Row,
  Typography,
} from "antd";
import { Images, MapPinned, Tags } from "lucide-react";

import { useState } from "react";
import UploadTag from "../atoms/UploadTag";
import useCreatePost from "../../hooks/useCreatePost";

import SpinLoading from "../../../../components/atoms/SpinLoading";
import { useAuthEntity } from "../../../../hooks/useAuthEntry";
import UploadMedia from "../atoms/UploadMedia";

const ModalUploadPost = ({
  isModalOpen,
  handleCancel,
  handleOk,
  form,
  setIsModalOpen,
}) => {
  const { entity } = useAuthEntity();
  const { mutate: createPost, isPending } = useCreatePost();
  const [tags, setTags] = useState([]);
  const [fileList, setFileList] = useState([]);
  const [isShowUploadImage, setIsShowUploadImage] = useState(false);
  const [isShowUploadTag, setIsShowUploadTag] = useState(false);
  // eslint-disable-next-line no-unused-vars
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

  const onFinish = (values) => {
    const formData = new FormData();
    formData.append("id", entity.id);
    formData.append("title", values.title);
    formData.append("content", values.content);
    formData.append("tags", JSON.stringify(tags));
    fileList.forEach((file) => {
      formData.append("media", file.originFileObj);
    });
    // formData.forEach((value, key) => {
    //   console.log(key, value);
    // });
    createPost(formData, {
      onSuccess: () => {
        message.success("Bài viết đã được tạo thành công!");
        form.resetFields();
        setIsShowUploadImage(false);
        setIsShowUploadTag(false);
        setIsShowUploadLocation(false);
        setFileList([]);
        setTags([]);
        setIsModalOpen(false);
      },
      onError: () => {
        message.error("Lỗi khi tạo bài viết!");
      },
    });
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
        setFileList([]);
        setTags([]);
      }}
      okText={isPending ? "Đang đăng..." : "Đăng tải"}
      cancelText="Hủy"
      maskClosable={false}
      centered
      style={{ minWidth: "50%" }}
    >
      {isPending && <SpinLoading />}
      <Row>
        <Col span={2}>
          <Avatar
            src={
              entity?.avatar ||
              "https://res.cloudinary.com/nienluan/image/upload/v1741015659/default-avatar-profile-icon-social-media-user-image-gray-avatar-icon-blank-profile-silhouette-illustration-vector_d3dgki.jpg"
            }
          ></Avatar>
        </Col>
        <Col span={20}>
          <Typography.Text style={{ fontWeight: "bold" }}>
            {entity.name}
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
          <Form form={form} onFinish={onFinish}>
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
            <UploadTag tags={tags} setTags={setTags} />
          </Col>
        )}
        {isShowUploadImage && (
          <Col span={24}>
            <UploadMedia fileList={fileList} setFileList={setFileList} />
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
