import { Col, Form, Input, message, Modal, Row, Typography } from "antd";
import SpinLoading from "../../../../components/atoms/SpinLoading";
import useCreateMenu from "../../hooks/useCreateMenu";
// import { BusinessContext } from "../../../../contexts/business.context";

const ModalAddMenu = ({
  isModalOpen,
  handleCancel,
  handleOk,
  form,
  setIsModalOpen,
  businessId,
}) => {
  // const { business } = useContext(BusinessContext);
  const { mutate: createMenu, isPending } = useCreateMenu();

  const onFinish = async (values) => {
    try {
      await form.validateFields();
      // console.log("Form values sau validate:", values);

      const formData = {
        menu_name: values.menu_name || "",
        business_id: businessId || "",
      };

      createMenu(formData, {
        onSuccess: () => {
          message.success("Thực đơn đã được tạo thành công!");
          form.resetFields();
          setIsModalOpen(false);
        },
        onError: () => {
          message.error("Lỗi khi tạo thực đơn!");
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
              <Input size="large" placeholder="Nhập tên thực đơn" />
            </Form.Item>
          </Form>
        </Col>
      </Row>
    </Modal>
  );
};

export default ModalAddMenu;
