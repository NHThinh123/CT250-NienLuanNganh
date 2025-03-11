import { Col, Form, Input, Modal, Row, Typography, App } from "antd";
import SpinLoading from "../../../../components/atoms/SpinLoading";
import useUpdateMenuMenu from "../../../menu/hooks/useUpdateMenu";

const ModalUpdateMenu = ({
  isModalOpen,
  handleOk,
  handleCancel,
  menuId,
  menuName,
  form,
  setIsModalOpen,
}) => {
  const { mutate: updateMenu, isPending } = useUpdateMenuMenu();
  const { message } = App.useApp();

  const onSubmit = async (values) => {
    try {
      await form.validateFields();

      updateMenu(
        { id: menuId, data: { menu_name: values.menu_name } },
        {
          onSuccess: () => {
            message.success("Thực đơn đã được cập nhật thành công!");
            setIsModalOpen(false);
          },
          onError: () => {
            message.error("Lỗi khi cập nhật thực đơn!");
          },
        }
      );
    } catch (error) {
      console.error("Lỗi khi validate form:", error);
    }
  };

  const handleCloseModal = () => {
    handleCancel();
  };

  return (
    <Modal
      title={
        <Typography.Title level={4} style={{ textAlign: "center" }}>
          Cập nhật menu
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
              menu_name: menuName,
            }}
          >
            <Form.Item
              label="Tên thực đơn:"
              name="menu_name"
              rules={[
                { required: true, message: "Vui lòng nhập tên thực đơn!" },
              ]}
            >
              <Input size="large" />
            </Form.Item>
          </Form>
        </Col>
      </Row>
    </Modal>
  );
};

export default ModalUpdateMenu;
