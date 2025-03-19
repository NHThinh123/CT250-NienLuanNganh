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
} from "antd";
import SpinLoading from "../../../../components/atoms/SpinLoading";
import useCreateReview from "../../../review/hooks/useCreateReview";
import { AuthContext } from "../../../../contexts/auth.context";
import { BusinessContext } from "../../../../contexts/business.context";
import { useContext, useState } from "react";

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

  const onFinish = async (values) => {
    try {
      await form.validateFields();
      console.log("Form values sau validate:", values);

      const formData = {
        user_id: user_id ? auth?.user?.id : null,
        business_id_review: business_id ? business?.business?.id : null,
        business_id: businessId,
        review_rating: values.review_rating,
        review_contents: values.review_contents,
      };

      console.log("📜 FormData trước khi gửi:");
      Object.entries(formData).forEach(([key, value]) => {
        console.log(`${key}:`, value);
      });

      createReview(formData, {
        onSuccess: () => {
          message.success("Đánh giá thành công!");
          form.resetFields(); // Reset toàn bộ form
          setValue(5); // Đặt lại số sao về 5
          form.setFieldsValue({ review_rating: 5 }); // Cập nhật giá trị trong Form
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
        form.resetFields(); // Xóa dữ liệu form
        setValue(5); // Đặt lại số sao về 5
        form.setFieldsValue({ review_rating: 5 }); // Cập nhật giá trị trong Form
        setIsModalOpen(false);
      }}
      okText={isPending ? "Đang gửi..." : "Gửi"}
      // okText="Gửi"
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
              rules={[
                {
                  required: true,
                  message: "Vui lòng đánh giá chất lượng quán!",
                },
              ]}
              initialValue={5}
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
                      form.setFieldsValue({ review_rating: newValue }); // Đồng bộ với form
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
            <Form.Item
              name="review_contents"
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập đánh giá!",
                },
              ]}
            >
              <Input.TextArea
                size="large"
                placeholder="Hãy chia sẻ chi tiết cảm nhận của bạn về quán này bạn nhé!"
                autoSize={{ minRows: 4, maxRows: 10 }}
              />
            </Form.Item>
          </Form>
        </Col>
      </Row>
    </Modal>
  );
};

export default ModalCreateReview;
