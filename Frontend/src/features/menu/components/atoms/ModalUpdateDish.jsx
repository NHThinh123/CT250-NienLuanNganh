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
import useUpdateDish from "../../../dish/hooks/useUpdateDish";

const MAX_IMAGES = 5;

const ModalUpdateDish = ({ isModalOpen, handleCancel, dishData }) => {
  const [form] = Form.useForm();
  const formRef = useRef(null);
  const [imageList, setImageList] = useState(dishData.dish_url || []);
  const [isImageError, setIsImageError] = useState(false);
  const { mutate: updateDish, isPending } = useUpdateDish();

  const resetFormScroll = () => {
    if (formRef.current) {
      formRef.current.scrollTop = 0;
    }
  };

  const handleImageChange = ({ fileList }) => {
    setImageList(fileList);
    form.setFieldsValue({ dish_image: fileList });
    setIsImageError(fileList.length === 0);
  };

  const onFinish = async (values) => {
    try {
      await form.validateFields();

      if (imageList.length === 0) {
        message.error("Vui lòng tải lên ít nhất 1 ảnh món!");
        setIsImageError(true);
        return;
      }

      const formData = new FormData();
      formData.append("dish_name", values.dish_name || "");
      formData.append("dish_description", values.dish_description || "");
      formData.append("dish_price", values.dish_price || 0);

      imageList.forEach((file) => {
        formData.append("dish_url", file.originFileObj || file.url);
      });

      updateDish(
        { _id: dishData._id, formData },
        {
          onSuccess: () => {
            message.success("Món đã được cập nhật thành công!");
            form.resetFields();
            setImageList([]);
            setIsImageError(false);
            resetFormScroll();
            handleCancel();
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

  return (
    <Modal
      title={
        <Typography.Title level={4} style={{ textAlign: "center" }}>
          Cập nhật món
        </Typography.Title>
      }
      open={isModalOpen}
      onOk={() => form.submit()}
      onCancel={handleCancel}
      okText={isPending ? "Đang cập nhật..." : "Cập nhật"}
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
            initialValues={{
              dish_name: dishData.dish_name,
              dish_description: dishData.dish_description,
              dish_price: dishData.dish_price,
            }}
          >
            <Form.Item
              name="dish_name"
              rules={[{ required: true, message: "Vui lòng nhập tên món!" }]}
            >
              <Input size="large" placeholder="Nhập tên món" />
            </Form.Item>
            <Form.Item
              name="dish_description"
              rules={[{ required: true, message: "Vui lòng nhập mô tả món!" }]}
            >
              <Input.TextArea
                size="large"
                placeholder="Nhập mô tả món"
                autoSize={{ minRows: 4, maxRows: 10 }}
              />
            </Form.Item>
            <Form.Item
              name="dish_price"
              rules={[
                { required: true, message: "Vui lòng nhập giá món!" },
                {
                  type: "number",
                  min: 1000,
                  message: "Giá món phải lớn hơn 1000 VND!",
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

            <div style={{ display: "flex" }}>
              <p style={{ fontSize: 15, padding: 10 }}>Cập nhật ảnh món ăn:</p>
              <Form.Item name="dish_image" valuePropName="fileList">
                <Upload
                  listType="picture-card"
                  fileList={imageList}
                  onChange={handleImageChange}
                  beforeUpload={() => false}
                  multiple
                  className={isImageError ? "upload-error" : ""}
                >
                  {imageList.length < MAX_IMAGES && (
                    <div>
                      <PlusOutlined />
                      <p style={{ marginTop: 8, borderRadius: 5 }}>Thêm ảnh</p>
                    </div>
                  )}
                </Upload>
                {isImageError && (
                  <span style={{ color: "red", fontSize: "14px" }}>
                    Vui lòng tải lên ít nhất 1 ảnh!
                  </span>
                )}
              </Form.Item>
            </div>
          </Form>
        </Col>
      </Row>
      <style>
        {`
          .upload-error .ant-upload {
            border: 1.5px solid red !important;
            border-radius: 5px
          }
        `}
      </style>
    </Modal>
  );
};

export default ModalUpdateDish;
