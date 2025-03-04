import { Col, Form, Input, Modal, Rate, Row, Typography } from "antd";
// import { useState } from "react";
// import SpinLoading from "../../../../components/atoms/SpinLoading";
// import useCreateReview from "../../../review/hooks/useCreateReview";
import { useState } from "react";

const ModalCreateReview = ({
  isModalOpen,
  handleCancel,
  handleOk,
  //   form,
  // setIsModalOpen,
}) => {
  const desc = ["Rất tệ", "Tệ", "Bình thường", "Tốt", "Rất tốt"];
  const [value, setValue] = useState(0);
  //   const { mutate: createReview, isPending } = useCreateReview();

  //   const onFinish = async (values) => {
  //     try {
  //       //   await form.validateFields();
  //       // console.log("Form values sau validate:", values);

  //       const formData = new FormData();
  //       formData.append("dish_name", values.dish_name || "");
  //       formData.append("dish_description", values.dish_description || "");
  //       formData.append("dish_price", values.dish_price || 0);

  //       // console.log("📜 FormData trước khi gửi:");
  //       // for (let pair of formData.entries()) {
  //       //   console.log(`${pair[0]}:`, pair[1]);
  //       // }

  //       createReview(formData, {
  //         onSuccess: () => {
  //           message.success("Đánh giá thành công!");
  //           //   form.resetFields();
  //           setIsModalOpen(false);
  //         },
  //         onError: () => {
  //           message.error("Lỗi khi đánh giá!");
  //         },
  //       });
  //     } catch (error) {
  //       console.error("Lỗi khi validate form:", error);
  //     }
  //   };

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
      }}
      //   okText={isPending ? "Đang gửi..." : "Gửi"}
      okText="Gửi"
      cancelText="Hủy"
      maskClosable={false}
      centered
      style={{ minWidth: "50%" }}
    >
      {/* {isPending && <SpinLoading />} */}
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
          // form={form}
          // onFinish={onFinish}
          >
            <Form.Item
              name="review_rating"
              rules={[
                {
                  required: true,
                  message: "Vui lòng đánh giá mức độ!",
                },
              ]}
            >
              <div style={{ display: "flex" }}>
                <Rate
                  tooltips={desc}
                  onChange={setValue}
                  value={value}
                  style={{ fontSize: 25 }}
                />
                {value ? (
                  <div
                    style={{
                      margin: "3px 0px 0px 15px",
                      fontWeight: "bold",
                    }}
                  >
                    {desc[value - 1]}
                  </div>
                ) : null}
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
                placeholder="Nhập nội dung đánh giá"
                autoSize={{ minRows: 4, maxRows: 10 }}
              />
            </Form.Item>
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

export default ModalCreateReview;
