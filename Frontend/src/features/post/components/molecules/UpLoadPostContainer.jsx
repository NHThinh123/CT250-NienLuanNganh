import { Button, Col, Form, Row, Typography } from "antd";
import { ChefHat, Utensils } from "lucide-react";
import BoxContainer from "../../../../components/atoms/BoxContainer";
import { useContext, useState } from "react";
import ModalUploadPost from "./ModalUploadPost";
import LoginRequiredModal from "../../../../components/organisms/LoginRequiredModal";
import { AuthContext } from "../../../../contexts/auth.context";

const UpLoadPostContainer = () => {
  const { auth } = useContext(AuthContext);
  const user_id = auth?.user?.id;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoginRequiredModalOpen, setIsLoginRequiredModalOpen] =
    useState(false);
  const [form] = Form.useForm();
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = async () => {
    form.submit();
    // setIsModalOpen(false);
  };
  const handleCancel = () => {
    form.resetFields();
    setIsModalOpen(false);
  };

  const showLoginRequiredModal = () => {
    setIsLoginRequiredModalOpen(true);
  };

  const handleCancelLoginRequiredModal = () => {
    setIsLoginRequiredModalOpen(false);
  };
  // Hành động được bảo vệ (yêu cầu đăng nhập)
  const handleAction = (action) => {
    if (!user_id) {
      showLoginRequiredModal();
    } else {
      action();
    }
  };
  return (
    <BoxContainer>
      <Row>
        <Col span={24}>
          <Typography.Title level={4}>Bài viết</Typography.Title>
          <Button
            type="default"
            style={{ width: "100%" }}
            onClick={() => handleAction(showModal)}
          >
            Đăng tải bài viết
          </Button>
        </Col>
      </Row>
      <Row
        justify={"center"}
        style={{ textAlign: "center", marginTop: "8px" }}
        gutter={[16, 16]}
      >
        <Col span={12}>
          <Button
            type="default"
            style={{ width: "100%", color: "#03c200" }}
            onClick={() => handleAction(showModal)}
          >
            <Utensils size={18} color="#03c200" strokeWidth={2.5} />
            Món ngon
          </Button>
        </Col>
        <Col span={12}>
          <Button
            type="default"
            style={{ width: "100%", color: "#ff4d4f" }}
            onClick={() => handleAction(showModal)}
          >
            <ChefHat size={18} color="#ff4d4f" strokeWidth={2.5} /> Quán xịn
          </Button>
        </Col>
      </Row>
      <ModalUploadPost
        form={form}
        isModalOpen={isModalOpen}
        handleCancel={handleCancel}
        handleOk={handleOk}
        setIsModalOpen={setIsModalOpen}
      />
      <LoginRequiredModal
        isModalOpen={isLoginRequiredModalOpen}
        handleCancel={handleCancelLoginRequiredModal}
      />
    </BoxContainer>
  );
};

export default UpLoadPostContainer;
