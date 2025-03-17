/* eslint-disable react-hooks/exhaustive-deps */

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
import { useState, useEffect } from "react";
import UploadTag from "../atoms/UploadTag";
import UploadMedia from "../atoms/UploadMedia";
import SpinLoading from "../../../../components/atoms/SpinLoading";
import { useAuthEntity } from "../../../../hooks/useAuthEntry";
import useUpdatePost from "../../hooks/useUpdatePost";
import SearchOptionBusiness from "../atoms/SearchOptionBusiness";
import useBusiness from "../../../business/hooks/useBusiness";

const ModalUpdatePost = ({
  isModalOpen,
  handleCancel,
  setIsModalOpen,
  postData,
  onPostUpdated, // Callback để cập nhật dữ liệu ở parent
}) => {
  const { entity } = useAuthEntity();
  const { mutate: updatePost, isPending } = useUpdatePost();
  const { businessData, isLoading } = useBusiness();

  const [form] = Form.useForm();
  // Trạng thái ban đầu từ postData
  const initialTags = postData?.tags.map((tag) => tag.tag_name) || [];
  const initialFileList =
    postData?.media.map((media) => ({
      uid: media._id,
      name: media.url.split("/").pop(),
      status: "done",
      url: media.url,
      isExisting: true, // Đánh dấu ảnh cũ từ server
    })) || [];
  const initialRestaurant = postData?.linked_business || null; // Lấy quán ăn liên quan từ postData

  const [tags, setTags] = useState(initialTags);
  const [fileList, setFileList] = useState(initialFileList);
  const [deletedMediaIds, setDeletedMediaIds] = useState([]);
  const [selectedRestaurant, setSelectedRestaurant] =
    useState(initialRestaurant); // State cho quán ăn
  const [isShowUploadImage, setIsShowUploadImage] = useState(true);
  const [isShowUploadTag, setIsShowUploadTag] = useState(true);
  const [isShowUploadLocation, setIsShowUploadLocation] = useState(true);

  // Khởi tạo lại trạng thái khi postData thay đổi
  useEffect(() => {
    form.setFieldsValue({
      title: postData?.title,
      content: postData?.content,
    });
    setTags(initialTags);
    setFileList(initialFileList);
    setDeletedMediaIds([]);
    setSelectedRestaurant(initialRestaurant); // Khởi tạo quán ăn từ postData
  }, [postData, form]);

  const handleShowUploadImage = () => setIsShowUploadImage(true);
  const handleShowUploadTag = () => setIsShowUploadTag(true);
  const handleShowUploadLocation = () => setIsShowUploadLocation(true);

  const onFinish = (values) => {
    const formData = new FormData();
    formData.append("id", entity.id);
    formData.append("post_id", postData._id);
    formData.append("title", values.title);
    formData.append("content", values.content);
    formData.append("tags", JSON.stringify(tags));
    formData.append("deletedMediaIds", JSON.stringify(deletedMediaIds));
    if (selectedRestaurant) {
      formData.append("related_business_id", selectedRestaurant._id); // Thêm linked_business_id
    }

    fileList.forEach((file, index) => {
      if (!file.isExisting && file.originFileObj) {
        formData.append("media", file.originFileObj);
        console.log(`Adding new file ${index}:`, file.originFileObj);
      }
    });

    // Debug FormData
    for (let pair of formData.entries()) {
      console.log(pair[0] + ": " + pair[1]);
    }

    updatePost(formData, {
      onSuccess: (response) => {
        message.success("Bài viết đã được cập nhật thành công!");

        // Reset toàn bộ trạng thái trong modal
        form.resetFields();
        setTags([]);
        setFileList([]);
        setDeletedMediaIds([]);
        setSelectedRestaurant(null); // Reset quán ăn
        setIsShowUploadImage(true);
        setIsShowUploadTag(true);
        setIsShowUploadLocation(true);

        // Gửi dữ liệu mới lên parent
        if (onPostUpdated) {
          onPostUpdated(response);
        }

        setIsModalOpen(false);
      },
      onError: (error) => {
        console.error("Update post error:", error);
        message.error("Lỗi khi cập nhật bài viết!");
      },
    });
  };

  const handleFileListChange = (newFileList) => {
    const oldFileIds = fileList
      .filter((file) => file.isExisting)
      .map((file) => file.uid);
    const newFileIds = newFileList
      .filter((file) => file.isExisting)
      .map((file) => file.uid);

    const newlyDeletedIds = oldFileIds.filter((id) => !newFileIds.includes(id));
    setDeletedMediaIds((prev) => [...new Set([...prev, ...newlyDeletedIds])]); // Loại bỏ trùng lặp

    setFileList(newFileList);
  };

  const handleCancelWithConfirmation = () => {
    Modal.confirm({
      title: "Xác nhận hủy",
      content: "Bạn có chắc chắn muốn hủy? Mọi thay đổi sẽ bị loại bỏ.",
      okText: "Có",
      cancelText: "Không",
      onOk: () => {
        form.setFieldsValue({
          title: postData?.title,
          content: postData?.content,
        });
        setTags(initialTags);
        setFileList(initialFileList);
        setDeletedMediaIds([]);
        setSelectedRestaurant(initialRestaurant); // Reset về quán ăn ban đầu
        setIsShowUploadImage(true);
        setIsShowUploadTag(true);
        setIsShowUploadLocation(true);
        handleCancel();
      },
    });
  };

  return (
    <Modal
      title={
        <Typography.Title level={4} style={{ textAlign: "center" }}>
          Chỉnh sửa bài viết
        </Typography.Title>
      }
      open={isModalOpen}
      onOk={() => form.submit()} // Gọi form.submit thay vì handleOk
      onCancel={handleCancelWithConfirmation}
      okText={isPending ? "Đang cập nhật..." : "Cập nhật"}
      cancelText="Hủy"
      maskClosable={false}
      centered
      style={{ minWidth: "50%" }}
      okButtonProps={{ disabled: isPending }} // Disable nút khi đang xử lý
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
                { required: true, message: "Vui lòng nhập tiêu đề bài viết!" },
              ]}
            >
              <Input size="large" placeholder="Nhập tiêu đề bài viết" />
            </Form.Item>
            <Form.Item
              name="content"
              rules={[
                { required: true, message: "Vui lòng nhập nội dung bài viết!" },
              ]}
            >
              <Input.TextArea
                size="large"
                placeholder="Hãy viết về trải nghiệm ẩm thực của bạn hôm nay!"
                autoSize={{ minRows: 4, maxRows: 10 }}
              />
            </Form.Item>
          </Form>
        </Col>
        {isShowUploadLocation && (
          <Col span={24} style={{ marginBottom: "16px" }}>
            <SearchOptionBusiness
              onSelect={(business) => setSelectedRestaurant(business)}
              businessData={businessData}
              isLoading={isLoading}
              initialRestaurant={selectedRestaurant}
            />
          </Col>
        )}
        {isShowUploadTag && (
          <Col span={24}>
            <UploadTag tags={tags} setTags={setTags} />
          </Col>
        )}
        {isShowUploadImage && (
          <Col span={24}>
            <UploadMedia
              fileList={fileList}
              setFileList={handleFileListChange}
            />
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
          <Typography.Text style={{ fontWeight: "bold" }}>
            Thêm vào bài viết của bạn:
          </Typography.Text>
        </Col>
        <Col span={4}>
          <Button type="text" onClick={handleShowUploadTag}>
            <Popover content="Thêm chủ đề">
              <Tags color="#e09c0b" size={24} strokeWidth={2.5} />
            </Popover>
          </Button>
        </Col>
        <Col span={4}>
          <Button type="text" onClick={handleShowUploadImage}>
            <Popover content="Thêm ảnh">
              <Images color="#03c200" size={24} strokeWidth={2.5} />
            </Popover>
          </Button>
        </Col>
        <Col span={4}>
          <Button type="text" onClick={handleShowUploadLocation}>
            <Popover content="Thêm địa điểm">
              <MapPinned color="#ff4d4f" size={24} strokeWidth={2.5} />
            </Popover>
          </Button>
        </Col>
      </Row>
    </Modal>
  );
};

export default ModalUpdatePost;
