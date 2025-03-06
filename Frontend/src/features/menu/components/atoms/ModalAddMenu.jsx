import { Col, Form, Input, message, Modal, Row, Typography } from "antd";
import SpinLoading from "../../../../components/atoms/SpinLoading";
import useCreateMenu from "../../hooks/useCreateMenu";
import { useContext } from "react";
import { MenuContext } from "../molecules/MenuContext";

const ModalAddMenu = ({
  isModalOpen,
  handleCancel,
  handleOk,
  form,
  setIsModalOpen,
  businessId,
}) => {
  const { mutate: createMenu, isPending } = useCreateMenu();
  const { handleMenuClick } = useContext(MenuContext);

  const onFinish = async (values) => {
    try {
      await form.validateFields();
      // console.log("Form values sau validate:", values);

      const formData = {
        menu_name: values.menu_name || "",
        business_id: businessId || "",
      };

      createMenu(formData, {
        onSuccess: (newMenu) => {
          message.success("Thực đơn đã được tạo thành công!");
          form.resetFields();
          setIsModalOpen(false);
          setTimeout(() => {
            handleMenuClick(newMenu._id);
          }, 300);
        },
        onError: () => {
          message.error("Lỗi khi tạo thực đơn!");
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
          Tạo Thực Đơn
        </Typography.Title>
      }
      open={isModalOpen}
      onOk={handleOk}
      onCancel={handleCancel}
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
              name="menu_name"
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập tên thực đơn!",
                },
              ]}
            >
              <Input
                size="large"
                placeholder="Nhập tên thực đơn"
                maxLength={50} // Giới hạn ký tự
                onChange={(e) => {
                  if (e.target.value.length > 50) {
                    message.warning("Tên thực đơn không nên quá 50 ký tự!");
                  }
                }}
              />
            </Form.Item>
          </Form>
        </Col>
      </Row>
    </Modal>
  );
};

export default ModalAddMenu;
