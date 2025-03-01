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

const ModalAddDish = ({
  isModalOpen,
  handleCancel,
  handleOk,
  form,
  setIsModalOpen,
  menuData,
}) => {
  console.log("menuData in ModalAddDish: ", menuData);
  const [imageList, setImageList] = useState([]);
  // const { business } = useContext(BusinessContext);
  const { mutate: createDish, isPending } = useCreateDish();

  const handleImageChange = ({ fileList }) => {
    setImageList(fileList);
  };

  const onFinish = (values) => {
    const formData = new FormData();
    // formData.append("user_id", business?.user?.id); //hakfhakffsaf
    formData.append("dish_name", values.dish_name);
    formData.append("dish_description", values.dish_description);
    formData.append("dish_price", values.dish_price);
    formData.append("menu_id", menuData._id); // Assuming you have menu_id in business context
    imageList.forEach((file) => {
      formData.append("dish_url", file.originFileObj);
    });
    // formData.forEach((value, key) => {
    //   console.log(key, value);
    // });
    console.log("formData: ", formData);
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
  };

  return (
    <Modal
      title={
        <Typography.Title level={4} style={{ textAlign: "center" }}>
          Tạo món ăn
        </Typography.Title>
      }
      open={isModalOpen}
      onOk={handleOk}
      onCancel={handleCancel}
      // onCancel={() => {
      //   handleCancel();
      //   // setIsShowUploadImage(false);
      // }}
      // okText={"Tạo"}
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
          <Form form={form} onFinish={onFinish}>
            <Form.Item
              name="dish_name"
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập tên món!",
                },
              ]}
            >
              <Input size="large" placeholder="Nhập tên món"></Input>
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
              ></Input.TextArea>
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
                defaultValue={1000}
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
                getValueFromEvent={(e) => e.fileList}
              >
                <Upload
                  listType="picture-card"
                  fileList={imageList}
                  onChange={handleImageChange}
                  beforeUpload={() => false} // Không upload lên server ngay
                >
                  {imageList.length >= 1 ? null : (
                    <div>
                      <PlusOutlined />
                      <div style={{ marginTop: 8 }}>Thêm ảnh</div>
                    </div>
                  )}
                </Upload>
              </Form.Item>
            </div>
            <Form.Item
              name="menu_name"
              // rules={[
              //   {
              //     required: true,
              //     message: "Vui lòng nhập tên thực đơn!",
              //   },
              // ]}
            >
              <Input size="large" disabled defaultValue={menuData.menu_name} />
            </Form.Item>
          </Form>
        </Col>
      </Row>
    </Modal>
  );
};

export default ModalAddDish;
