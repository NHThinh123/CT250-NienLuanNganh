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
import { useContext, useEffect, useState } from "react";
import { PlusOutlined } from "@ant-design/icons";

const ModalCreateReview = ({
  isModalOpen,
  handleCancel,
  handleOk,
  form,
  setIsModalOpen,
  businessId,
}) => {
  const desc = ["Rất tệ", "Tệ", "Bình thường", "Tốt", "Rất tốt"];
  const [value, setValue] = useState(5);
  const { auth } = useContext(AuthContext);
  const { business } = useContext(BusinessContext);
  const user_id = auth?.user?.id;
  const business_id = business?.business?.id;
  const { mutate: createReview, isPending } = useCreateReview();
  const [fileList, setFileList] = useState([]);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState("");

  const MAX_IMAGES = 5;
  const MAX_VIDEOS = 1;

  const getMediaCounts = (files) => {
    return files.reduce(
      (acc, file) => {
        if (file.type?.startsWith("image/")) {
          acc.images++;
        } else if (file.type?.startsWith("video/")) {
          acc.videos++;
        }
        return acc;
      },
      { images: 0, videos: 0 }
    );
  };

  // Tạo preview URL khi fileList thay đổi
  useEffect(() => {
    const updatedFileList = fileList.map((file) => {
      if (!file.url && !file.preview && file.originFileObj) {
        file.preview = URL.createObjectURL(file.originFileObj);
      }
      return file;
    });
    setFileList(updatedFileList);

    // Dọn dẹp URL khi component unmount hoặc fileList thay đổi
    return () => {
      updatedFileList.forEach((file) => {
        if (file.preview) {
          URL.revokeObjectURL(file.preview);
        }
      });
    };
  }, [fileList]);

  const handlePreview = async (file) => {
    setPreviewUrl(file.preview || file.url);
    setPreviewOpen(true);
  };

  const uploadProps = {
    listType: "picture-card",
    fileList: fileList,
    onRemove: (file) => {
      const newFileList = fileList.filter((item) => item.uid !== file.uid);
      setFileList(newFileList);
    },
    onPreview: handlePreview,
    beforeUpload: (file) => {
      const isMedia =
        file.type.startsWith("image/") || file.type.startsWith("video/");
      if (!isMedia) {
        message.error("Chỉ có thể tải lên ảnh hoặc video!");
        return Upload.LIST_IGNORE;
      }

      const isLt10M = file.size / 1024 / 1024 < 10;
      if (!isLt10M) {
        message.error("File phải nhỏ hơn 10MB!");
        return Upload.LIST_IGNORE;
      }

      const currentCounts = getMediaCounts(fileList);
      const isImage = file.type.startsWith("image/");
      const isVideo = file.type.startsWith("video/");

      if (isImage && currentCounts.images >= MAX_IMAGES) {
        message.error(`Chỉ có thể tải lên tối đa ${MAX_IMAGES} ảnh!`);
        return Upload.LIST_IGNORE;
      }

      if (isVideo && currentCounts.videos >= MAX_VIDEOS) {
        message.error(`Chỉ có thể tải lên tối đa ${MAX_VIDEOS} video!`);
        return Upload.LIST_IGNORE;
      }

      setFileList((prev) => [...prev, file]);
      return false; // Ngăn upload tự động lên server
    },
    multiple: true,
    accept: "image/*,video/*",
    itemRender: (originNode, file) => {
      if (file.type?.startsWith("video/")) {
        return (
          <div style={{ position: "relative" }}>
            <video
              src={file.preview || file.url}
              style={{ width: "100%", height: "100%" }}
              muted
            />
          </div>
        );
      }
      return originNode; // Hiển thị ảnh mặc định của Ant Design
    },
  };

  const onFinish = async (values) => {
    try {
      await form.validateFields(["review_rating"]); // Chỉ validate trường bắt buộc
      console.log("Form values sau validate:", values);

      const formData = new FormData();
      if (user_id) {
        formData.append("user_id", auth?.user?.id);
      }
      if (business_id) {
        formData.append("business_id_review", business?.business?.id);
      }
      if (businessId) {
        formData.append("business_id", businessId);
      }
      formData.append("review_rating", values.review_rating);
      if (values.review_contents) {
        formData.append("review_contents", values.review_contents);
      }

      // Gửi media dưới dạng file trực tiếp với key "media"
      if (fileList.length > 0) {
        fileList.forEach((file) => {
          formData.append("media", file.originFileObj || file);
        });
      }

      console.log("📜 FormData trước khi gửi:");
      for (let [key, value] of formData.entries()) {
        console.log(`${key}:`, value);
      }

      createReview(formData, {
        onSuccess: () => {
          message.success("Đánh giá thành công!");
          form.resetFields();
          setValue(5);
          form.setFieldsValue({ review_rating: 5 });
          setFileList([]); // Xóa fileList sau khi gửi thành công
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

  const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Tải lên</div>
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
        setFileList([]);
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
            <Form.Item name="media" label="Tải lên Ảnh/Video:">
              <div>
                <Upload {...uploadProps}>
                  {fileList.length < MAX_IMAGES + MAX_VIDEOS && uploadButton}
                </Upload>
                <Modal
                  open={previewOpen}
                  footer={null}
                  onCancel={() => setPreviewOpen(false)}
                >
                  {previewUrl?.includes("video") ||
                  fileList.some((f) => f.type?.startsWith("video/")) ? (
                    <video
                      controls
                      src={previewUrl}
                      style={{ width: "100%" }}
                    />
                  ) : (
                    <img
                      alt="preview"
                      style={{ width: "100%" }}
                      src={previewUrl}
                    />
                  )}
                </Modal>
                <Typography.Text type="secondary">
                  (Tối đa {MAX_IMAGES} ảnh và {MAX_VIDEOS} video)
                </Typography.Text>
              </div>
            </Form.Item>
          </Form>
        </Col>
      </Row>
    </Modal>
  );
};

export default ModalCreateReview;
