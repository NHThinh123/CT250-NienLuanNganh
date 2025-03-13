import { Button, Col, Form, Row, Typography } from "antd";
// import { ChefHat, Utensils } from "lucide-react";
import BoxContainer from "../../../../components/atoms/BoxContainer";
import { useState } from "react";
import ModalUploadPost from "./ModalUploadPost";
import LoginRequiredModal from "../../../../components/organisms/LoginRequiredModal";

import { useAuthEntity } from "../../../../hooks/useAuthEntry";

const UpLoadPostContainer = ({
  postData,
  isEditMode,
  isCreate,
  isShowModalEdit,
  cancelModalEdit,
}) => {
  const { entity } = useAuthEntity();
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
    if (!entity.id) {
      showLoginRequiredModal();
    } else {
      action();
    }
  };
  if (isEditMode || !isCreate) {
    return (
      <>
        <ModalUploadPost
          form={form}
          isModalOpen={isShowModalEdit}
          handleCancel={cancelModalEdit}
          handleOk={handleOk}
          setIsModalOpen={setIsModalOpen}
          postData={postData}
          isEditMode={isEditMode}
        />
        <LoginRequiredModal
          isModalOpen={isLoginRequiredModalOpen}
          handleCancel={handleCancelLoginRequiredModal}
        />
      </>
    );
  }
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

      <ModalUploadPost
        form={form}
        isModalOpen={isModalOpen}
        handleCancel={handleCancel}
        handleOk={handleOk}
        setIsModalOpen={setIsModalOpen}
        postData={postData}
        isEditMode={isEditMode}
      />
      <LoginRequiredModal
        isModalOpen={isLoginRequiredModalOpen}
        handleCancel={handleCancelLoginRequiredModal}
      />
    </BoxContainer>
  );
};

export default UpLoadPostContainer;
