import { PlusOutlined } from "@ant-design/icons";
import {
  Col,
  Form,
  Input,
  InputNumber,
  message,
  Modal,
  Row,
  Typography,
  Upload,
} from "antd";
import { useRef, useState } from "react";
import SpinLoading from "../../../../components/atoms/SpinLoading";
import useCreateDish from "../../../dish/hooks/useCreateDish";

const ModalAddDish = ({
  isModalOpen,
  handleCancel,
  handleOk,
  form,
  setIsModalOpen,
  menuData,
}) => {
  const [image, setImage] = useState(null);
  const formRef = useRef(null);
  const [previewImage, setPreviewImage] = useState("");
  const [previewOpen, setPreviewOpen] = useState(false);
  const { mutate: createDish, isPending } = useCreateDish();

  const resetFormScroll = () => {
    if (formRef.current) {
      formRef.current.scrollTop = 0;
    }
  };

  const handleModalClose = () => {
    handleCancel();
    setImage(null);
    resetFormScroll();
  };

  const handleImageChange = ({ fileList }) => {
    if (fileList.length > 0) {
      const file = fileList[0];
      file.preview = URL.createObjectURL(file.originFileObj);
      setImage(file);
    } else {
      setImage(null); // Cho phép không có ảnh
    }
  };

  const handlePreview = async () => {
    setPreviewImage(image?.url || image?.preview);
    setPreviewOpen(true);
  };

  const onFinish = async (values) => {
    try {
      await form.validateFields();

      const formData = new FormData();
      formData.append("dish_name", values.dish_name || "");
      formData.append("dish_description", values.dish_description || "");
      formData.append("dish_price", values.dish_price || 0);
      formData.append("menu_id", menuData._id || "");
      if (image) {
        formData.append("dish_url", image.originFileObj); // Chỉ thêm nếu có ảnh
      }

      createDish(formData, {
        onSuccess: () => {
          message.success("Món đã được tạo thành công!");
          form.resetFields();
          setImage(null);
          resetFormScroll();
          setIsModalOpen(false);
        },
        onError: () => {
          message.error("Lỗi khi tạo món!");
        },
      });
    } catch (error) {
      console.error("Lỗi khi validate form:", error);
    }
  };

  return (
    <Modal
      title={
        <Typography.Title level={4} style={{ textAlign: "center" }}>
          Tạo món
        </Typography.Title>
      }
      open={isModalOpen}
      onOk={handleOk}
      onCancel={handleModalClose}
      okText={isPending ? "Đang tạo..." : "Tạo"}
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
            onFinish={onFinish}
            initialValues={{ dish_price: 1000 }}
          >
            <Form.Item
              label="Tên món:"
              name="dish_name"
              rules={[
                { required: true, message: "Vui lòng nhập tên món!" },
                { max: 50, message: "Tên món không được vượt quá 50 ký tự!" },
              ]}
            >
              <Input size="large" placeholder="Nhập tên món" />
            </Form.Item>
            <Form.Item label="Mô tả món:" name="dish_description">
              <Input.TextArea
                size="large"
                placeholder="Nhập mô tả món"
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
                  message: "Giá món phải từ 1.000 VND!",
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
                placeholder="Nhập giá món"
                addonAfter="VND"
                step={1000}
                style={{ width: "100%" }}
                formatter={(value) =>
                  value?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                }
                parser={(value) => value?.replace(/\D/g, "")}
              />
            </Form.Item>
            <Form.Item name="dish_image" label="Thêm ảnh món ăn:">
              <div>
                <Upload
                  listType="picture-card"
                  fileList={image ? [image] : []}
                  onChange={handleImageChange}
                  onPreview={handlePreview}
                  beforeUpload={() => false}
                >
                  {!image && (
                    <div>
                      <PlusOutlined />
                      <p style={{ marginTop: 8 }}>Thêm ảnh</p>
                    </div>
                  )}
                </Upload>
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

export default ModalAddDish;
