import {
  Avatar,
  Col,
  Form,
  Input,
  message,
  Modal,
  Rate,
  Row,
  Typography,
  Upload,
} from "antd";
import SpinLoading from "../../../../components/atoms/SpinLoading";
import useCreateReview from "../../../review/hooks/useCreateReview";
import { AuthContext } from "../../../../contexts/auth.context";
import { BusinessContext } from "../../../../contexts/business.context";
import { useContext, useRef, useState } from "react";
import { PlusOutlined, EyeOutlined, DeleteOutlined } from "@ant-design/icons"; // Thêm icon EyeOutlined và DeleteOutlined

const ModalCreateReview = ({
  isModalOpen,
  handleCancel,
  handleOk,
  form,
  setIsModalOpen,
  businessId,
}) => {
  const desc = ["Rất tệ", "Tệ", "Bình thường", "Tốt", "Rất tốt"];
  const formRef = useRef(null);
  const [value, setValue] = useState(5);
  const { auth } = useContext(AuthContext);
  const { business } = useContext(BusinessContext);
  const user_id = auth?.user?.id;
  const business_id = business?.business?.id;
  const { mutate: createReview, isPending } = useCreateReview();
  const [imageFileList, setImageFileList] = useState([]);
  const [videoFileList, setVideoFileList] = useState([]);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState("");
  const [previewType, setPreviewType] = useState("image");

  const MAX_IMAGES = 5;
  const MAX_VIDEOS = 1;

  const resetFormScroll = () => {
    if (formRef.current) {
      formRef.current.scrollTop = 0;
    }
  };

  const handleImageChange = async ({ fileList: newFileList }) => {
    if (newFileList.length > MAX_IMAGES) {
      message.error(`Chỉ có thể tải lên tối đa ${MAX_IMAGES} ảnh!`);
      setImageFileList(newFileList.slice(0, MAX_IMAGES));
    } else {
      setImageFileList(newFileList);
    }
  };

  const handleVideoChange = async ({ fileList: newFileList }) => {
    if (newFileList.length > MAX_VIDEOS) {
      message.error(`Chỉ có thể tải lên tối đa ${MAX_VIDEOS} video!`);
      setVideoFileList(newFileList.slice(0, MAX_VIDEOS));
      return;
    }

    setVideoFileList(newFileList);
  };

  const handlePreview = (file) => {
    const previewUrl =
      file.url ||
      (file.originFileObj ? URL.createObjectURL(file.originFileObj) : "");

    const isVideo = file.type?.startsWith("video/");

    setPreviewUrl(previewUrl);
    setPreviewType(isVideo ? "video" : "image");
    setPreviewOpen(true);
  };

  const handleRemoveVideo = (file) => {
    // Xóa video khỏi videoFileList
    const updatedFileList = videoFileList.filter((item) => item.uid !== file.uid);
    setVideoFileList(updatedFileList);
    message.success("Đã xóa video!");
  };

  const imageUploadProps = {
    listType: "picture-card",
    fileList: imageFileList,
    onChange: handleImageChange,
    onPreview: handlePreview,
    beforeUpload: (file) => {
      const isImage = file.type.startsWith("image/");
      if (!isImage) {
        message.error("Chỉ có thể tải lên ảnh!");
        return Upload.LIST_IGNORE;
      }
      const isLt10M = file.size / 1024 / 1024 < 10;
      if (!isLt10M) {
        message.error("Ảnh phải nhỏ hơn 10MB!");
        return Upload.LIST_IGNORE;
      }
      return false;
    },
    accept: "image/*",
    multiple: true,
  };

  const videoUploadProps = {
    listType: "picture-card",
    fileList: videoFileList,
    onChange: handleVideoChange,
    onPreview: handlePreview,
    beforeUpload: (file) => {
      const isVideo = file.type.startsWith("video/");
      if (!isVideo) {
        message.error("Chỉ có thể tải lên video!");
        return Upload.LIST_IGNORE;
      }
      const isLt10M = file.size / 1024 / 1024 < 10;
      if (!isLt10M) {
        message.error("Video phải nhỏ hơn 10MB!");
        return Upload.LIST_IGNORE;
      }
      return false;
    },
    accept: "video/*",
    multiple: false,
    // Tùy chỉnh giao diện của video
    itemRender: (originNode, file) => {
      if (file.type?.startsWith("video/")) {
        const videoUrl = file.url || (file.originFileObj ? URL.createObjectURL(file.originFileObj) : "");
        return (
          <div style={{ position: "relative", width: "100%", height: "100%" }}>
            <video
              src={videoUrl}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
              muted
            />
            {/* Overlay với các icon xem và xóa */}
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: "rgba(0, 0, 0, 0.3)", // Nền mờ để icon nổi bật
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: "10px",
              }}
            >
              {/* Icon xem */}
              <EyeOutlined
                style={{ fontSize: "24px", color: "white", cursor: "pointer" }}
                onClick={() => handlePreview(file)}
              />
              {/* Icon xóa */}
              <DeleteOutlined
                style={{ fontSize: "24px", color: "white", cursor: "pointer" }}
                onClick={() => handleRemoveVideo(file)}
              />
            </div>
          </div>
        );
      }
      return originNode; // Giữ nguyên giao diện mặc định cho các file khác
    },
  };

  const onFinish = async (values) => {
    try {
      await form.validateFields(["review_rating"]);
      const formData = new FormData();
      if (user_id) formData.append("user_id", auth?.user?.id);
      if (business_id)
        formData.append("business_id_review", business?.business?.id);
      if (businessId) formData.append("business_id", businessId);
      formData.append("review_rating", values.review_rating);
      if (values.review_contents)
        formData.append("review_contents", values.review_contents);

      if (imageFileList.length > 0) {
        imageFileList.forEach((file) => {
          formData.append("media", file.originFileObj || file);
        });
      }
      if (videoFileList.length > 0) {
        videoFileList.forEach((file) => {
          formData.append("media", file.originFileObj || file);
        });
      }

      createReview(formData, {
        onSuccess: () => {
          message.success("Đánh giá thành công!");
          form.resetFields();
          setValue(5);
          form.setFieldsValue({ review_rating: 5 });
          resetFormScroll();
          setImageFileList([]);
          setVideoFileList([]);
          setIsModalOpen(false);
        },
        onError: () => {
          message.error("Lỗi khi đánh giá!");
        },
      });
    } catch (error) {
      console.error("Lỗi khi validate form:", error);
    }
  };

  const uploadButton = (text) => (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>{text}</div>
    </div>
  );

  return (
    <Modal
      title={
        <Typography.Title level={4} style={{ textAlign: "center" }}>
          Đánh giá
        </Typography.Title>
      }
      open={isModalOpen}
      onOk={handleOk}
      onCancel={() => {
        handleCancel();
        form.resetFields();
        setValue(5);
        form.setFieldsValue({ review_rating: 5 });
        resetFormScroll();
        setImageFileList([]);
        setVideoFileList([]);
        setIsModalOpen(false);
      }}
      okText={isPending ? "Đang gửi..." : "Gửi"}
      cancelText="Hủy"
      maskClosable={false}
      centered
      style={{ minWidth: "50%" }}
    >
      {isPending && <SpinLoading />}
      <Row
        ref={formRef}
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
            <div style={{ display: "flex", marginBottom: 10 }}>
              <Avatar
                src={
                  user_id && !business_id
                    ? auth?.user.avatar
                    : business?.business.avatar
                }
                alt="Ảnh"
                size={60}
              />
              <p
                style={{
                  margin: "0px 0px 0px 10px",
                  fontWeight: "bold",
                  placeContent: "center",
                }}
              >
                {user_id && !business_id
                  ? auth?.user.name
                  : business?.business.business_name}
              </p>
            </div>
            <Form.Item
              name="review_rating"
              initialValue={5}
              rules={[{ required: true, message: "Vui lòng chọn số sao!" }]}
            >
              <div style={{ display: "flex" }}>
                <p style={{ fontSize: 15, marginRight: 10 }}>
                  Chất lượng quán:
                </p>
                <div style={{ display: "flex" }}>
                  <Rate
                    tooltips={desc}
                    onChange={(newValue) => {
                      if (newValue === 0) return;
                      setValue(newValue);
                      form.setFieldsValue({ review_rating: newValue });
                    }}
                    value={value}
                    style={{ fontSize: 25 }}
                  />
                  {value ? (
                    <div
                      style={{
                        margin: "3px 0px 0px 15px",
                        fontWeight: "bold",
                        color: "orange",
                      }}
                    >
                      {desc[value - 1]}
                    </div>
                  ) : null}
                </div>
              </div>
            </Form.Item>
            <Form.Item name="review_contents">
              <Input.TextArea
                size="large"
                placeholder="Hãy chia sẻ chi tiết cảm nhận của bạn về quán này bạn nhé!"
                autoSize={{ minRows: 4, maxRows: 10 }}
              />
            </Form.Item>
            <Form.Item label="Tải lên Ảnh/Video:">
              <div style={{ display: "block" }}>
                <div style={{ marginBottom: "16px" }}>
                  <Upload {...imageUploadProps}>
                    {imageFileList.length < MAX_IMAGES &&
                      uploadButton("Tải lên ảnh")}
                  </Upload>
                  <Typography.Text type="secondary">
                    (Tối đa {MAX_IMAGES} ảnh)
                  </Typography.Text>
                </div>
                <div>
                  <Upload {...videoUploadProps}>
                    {videoFileList.length < MAX_VIDEOS &&
                      uploadButton("Tải lên video")}
                  </Upload>
                  <Typography.Text type="secondary">
                    (Tối đa {MAX_VIDEOS} video)
                  </Typography.Text>
                </div>
              </div>
              <Modal
                open={previewOpen}
                footer={null}
                onCancel={() => {
                  if (
                    previewUrl &&
                    typeof previewUrl === "string" &&
                    previewUrl.startsWith("blob:")
                  ) {
                    URL.revokeObjectURL(previewUrl);
                  }
                  setPreviewOpen(false);
                  setPreviewUrl("");
                }}
                width={previewType === "video" ? "50%" : "40%"}
              >
                {previewUrl ? (
                  previewType === "video" ? (
                    <video
                      controls
                      autoPlay
                      src={previewUrl}
                      style={{ width: "100%" }}
                    />
                  ) : (
                    <img
                      alt="preview"
                      style={{ width: "100%" }}
                      src={previewUrl}
                    />
                  )
                ) : (
                  <p>Không có nội dung để hiển thị</p>
                )}
              </Modal>
            </Form.Item>
          </Form>
        </Col>
      </Row>
    </Modal>
  );
};

export default ModalCreateReview;