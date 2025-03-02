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
import { useState } from "react";
import SpinLoading from "../../../../components/atoms/SpinLoading";
import useCreateDish from "../../../dish/hooks/useCreateDish";
// import { BusinessContext } from "../../../../contexts/business.context";

const MAX_IMAGES = 5; //Giới hạn 5 ảnh tải lên

const ModalAddDish = ({
  isModalOpen,
  handleCancel,
  handleOk,
  form,
  setIsModalOpen,
  menuData,
}) => {
  const [imageList, setImageList] = useState([]);
  // const { business } = useContext(BusinessContext);
  const { mutate: createDish, isPending } = useCreateDish();

  const handleImageChange = ({ fileList }) => {
    setImageList(fileList);
    form.setFieldsValue({ dish_image: fileList });
  };

  const onFinish = async (values) => {
    try {
      await form.validateFields();
      // console.log("Form values sau validate:", values);

      const formData = new FormData();
      formData.append("dish_name", values.dish_name || "");
      formData.append("dish_description", values.dish_description || "");
      formData.append("dish_price", values.dish_price || 0);
      formData.append("menu_id", menuData._id || "");

      if (imageList.length > 0) {
        imageList.forEach((file) => {
          formData.append(`dish_url`, file.originFileObj);
        });
      } else {
        console.warn("⚠ Không có ảnh nào được chọn!");
      }

      // console.log("📜 FormData trước khi gửi:");
      // for (let pair of formData.entries()) {
      //   console.log(`${pair[0]}:`, pair[1]);
      // }

      createDish(formData, {
        onSuccess: () => {
          message.success("Món đã được tạo thành công!");
          form.resetFields();
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

  // if (!business.isAuthenticated) {
  //   return null; // Ẩn modal nếu không phải tài khoản business
  // }

  return (
    <Modal
      title={
        <Typography.Title level={4} style={{ textAlign: "center" }}>
          Tạo món
        </Typography.Title>
      }
      open={isModalOpen}
      onOk={handleOk}
      onCancel={() => {
        handleCancel();
        setImageList([]);
      }}
      okText={isPending ? "Đang tạo..." : "Tạo"}
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
          <Form
            form={form}
            onFinish={onFinish}
            initialValues={{ dish_price: 1000 }}
          >
            <Form.Item
              name="dish_name"
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập tên món!",
                },
              ]}
            >
              <Input size="large" placeholder="Nhập tên món" />
            </Form.Item>
            <Form.Item
              name="dish_description"
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập mô tả món!",
                },
              ]}
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
                {
                  required: true,
                  message: "Vui lòng nhập giá món!",
                },
                {
                  type: "number",
                  min: 1000,
                  message: "Giá món phải lớn hơn hoặc bằng 1000 VND!",
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
              <p style={{ fontSize: 15, padding: 10 }}>Thêm ảnh món ăn:</p>
              <Form.Item
                name="dish_image"
                // label="Thêm ảnh món"
                valuePropName="fileList"
                getValueFromEvent={(e) => e?.fileList}
              >
                <Upload
                  listType="picture-card"
                  fileList={imageList}
                  onChange={handleImageChange}
                  beforeUpload={() => false} // Không upload lên server ngay
                  multiple
                >
                  {imageList.length < MAX_IMAGES && ( // Ẩn nút khi đạt giới hạn ảnh
                    <div>
                      <PlusOutlined />
                      <div style={{ marginTop: 8 }}>Thêm ảnh</div>
                    </div>
                  )}
                </Upload>
              </Form.Item>
            </div>
            {/* <Form.Item
              name="menu_name"
              // rules={[
              //   {
              //     required: true,
              //     message: "Vui lòng nhập tên thực đơn!",
              //   },
              // ]}
            >
              <Input size="large" disabled initialValue={menuData.menu_name} />
            </Form.Item> */}
          </Form>
        </Col>
      </Row>
    </Modal>
  );
};

export default ModalAddDish;
