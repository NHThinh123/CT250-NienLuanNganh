import {
  Button,
  Col,
  Form,
  Input,
  InputNumber,
  Modal,
  Row,
  Typography,
  Upload,
  App,
} from "antd";
import { useEffect, useRef, useState } from "react";
import SpinLoading from "../../../../components/atoms/SpinLoading";
import useUpdateDish from "../../../dish/hooks/useUpdateDish";
import { UploadOutlined } from "@ant-design/icons";

const ModalUpdateDish = ({
  isModalOpen,
  handleOk,
  handleCancel,
  dishData,
  form,
  setIsModalOpen,
}) => {
  const formRef = useRef(null);
  const [image, setImage] = useState(null);
  const [previewImage, setPreviewImage] = useState("");
  const [previewOpen, setPreviewOpen] = useState(false);
  const { mutate: updateDish, isPending } = useUpdateDish();
  const { message } = App.useApp();

  useEffect(() => {
    if (dishData) {
      const formattedImage = dishData.dish_url
        ? {
            uid: "-1",
            name: "image.jpg",
            status: "done",
            url: dishData.dish_url,
          }
        : null;

      setImage(formattedImage);
    }
  }, [dishData, form]);

  const resetFormScroll = () => {
    if (formRef.current) {
      formRef.current.scrollTop = 0;
    }
  };

  const handleImageChange = ({ fileList }) => {
    const file = fileList.length > 0 ? fileList[0] : null;
    if (file && !file.url && !file.preview) {
      file.preview = URL.createObjectURL(file.originFileObj);
    }
    setImage(file);
  };

  const handlePreview = async (file) => {
    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
  };

  const onSubmit = async (values) => {
    try {
      await form.validateFields();

      const formattedImage = image.originFileObj || image.url;

      updateDish(
        { id: dishData._id, data: { ...values, dish_url: formattedImage } },
        {
          onSuccess: () => {
            message.success("Món đã được cập nhật thành công!");
            setImage(null);
            resetFormScroll();
            setIsModalOpen(false);
          },
          onError: () => {
            message.error("Lỗi khi cập nhật món!");
          },
        }
      );
    } catch (error) {
      console.error("Lỗi khi validate form:", error);
    }
  };

  const handleCloseModal = () => {
    setImage(
      dishData?.dish_url
        ? {
            uid: "-1",
            name: "image.jpg",
            status: "done",
            url: dishData.dish_url,
          }
        : null
    );
    handleCancel();
    resetFormScroll();
  };

  return (
    <Modal
      title={
        <Typography.Title level={4} style={{ textAlign: "center" }}>
          Cập nhật món
        </Typography.Title>
      }
      open={isModalOpen}
      onOk={handleOk}
      onCancel={handleCloseModal}
      okText={isPending ? "Đang lưu..." : "Lưu"}
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
          <Form
            form={form}
            onFinish={onSubmit}
            initialValues={{
              dish_name: dishData?.dish_name,
              dish_description: dishData?.dish_description,
              dish_price: dishData?.dish_price || 1000,
            }}
          >
            <Form.Item
              label="Tên món:"
              name="dish_name"
              rules={[
                { required: true, message: "Vui lòng nhập tên món!" },
                { max: 50, message: "Tên món không được vượt quá 50 ký tự!" },
              ]}
            >
              <Input size="large" />
            </Form.Item>
            <Form.Item label="Mô tả món:" name="dish_description">
              <Input.TextArea
                size="large"
                autoSize={{ minRows: 4, maxRows: 10 }}
              />
            </Form.Item>
            <Form.Item
              label="Giá món:"
              name="dish_price"
              rules={[
                { required: true, message: "Vui lòng nhập giá món!" },
                {
                  type: "number",
                  min: 1000,
                  message: "Giá món phải lớn hơn 1000 VND!",
                },
                {
                  type: "number",
                  max: 100000000,
                  message: "Giá món phải nhỏ hơn 100.000.000 VND!",
                },
              ]}
            >
              <InputNumber
                size="large"
                min={1000}
                addonAfter="VND"
                step={1000}
                style={{ width: "100%" }}
                formatter={(value) =>
                  value?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                }
                parser={(value) => value?.replace(/\D/g, "")}
              />
            </Form.Item>

            <Form.Item name="dish_url" label="Cập nhật ảnh món ăn:">
              <div style={{ display: "flex", gap: "16px" }}>
                <Upload
                  listType="picture-card"
                  fileList={image ? [image] : []}
                  showUploadList={{ showRemoveIcon: false }}
                  onChange={handleImageChange}
                  onPreview={handlePreview}
                  beforeUpload={() => false}
                />

                <Button
                  onClick={() =>
                    document.getElementById("upload-input").click()
                  }
                  style={{
                    height: "100%",
                  }}
                >
                  <div style={{ margin: "7px 0px" }}>
                    <UploadOutlined />
                    <p style={{ margin: 0 }}>Upload ảnh khác</p>
                  </div>
                </Button>

                <input
                  id="upload-input"
                  type="file"
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={(e) => {
                    if (e.target.files.length > 0) {
                      const file = e.target.files[0];
                      const newImage = {
                        uid: "-1",
                        name: file.name,
                        status: "done",
                        originFileObj: file,
                        url: URL.createObjectURL(file),
                      };
                      setImage(newImage);
                    }
                  }}
                />

                <Modal
                  open={previewOpen}
                  footer={null}
                  onCancel={() => setPreviewOpen(false)}
                >
                  <img
                    alt="preview"
                    style={{ width: "100%" }}
                    src={previewImage}
                  />
                </Modal>
              </div>
            </Form.Item>
          </Form>
        </Col>
      </Row>
    </Modal>
  );
};

export default ModalUpdateDish;
