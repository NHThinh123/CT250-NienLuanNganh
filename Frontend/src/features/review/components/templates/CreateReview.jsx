import { Button, Form } from "antd";
import { useContext, useState } from "react";
import ModalCreateReview from "../organisms/ModalCreateReview";
import LoginRequiredModal from "../../../../components/organisms/LoginRequiredModal";
import { AuthContext } from "../../../../contexts/auth.context";
import { BusinessContext } from "../../../../contexts/business.context";
import BoxContainer from "../../../../components/atoms/BoxContainer";

const CreateReview = ({ businessId }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { auth } = useContext(AuthContext);
  const { business } = useContext(BusinessContext);
  const user_id = auth?.user?.id;
  const business_id = business?.business?.id;
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
    if (!user_id && !business_id) {
      showLoginRequiredModal();
    } else {
      action();
    }
  };

  return (
    <BoxContainer>
      {!(business.business.id == businessId) && (
        <Button
          type="link"
          onClick={() => handleAction(showModal)}
          style={{
            cursor: "pointer",
            border: "none",
            fontSize: 13,
            width: "100%",
            height: 35,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "#CDE5FF";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "#FFFFFF";
          }}
        >
          <p
            style={{
              margin: 2,
              fontWeight: "bold",
              color: "#1677FF",
            }}
          >
            VIẾT ĐÁNH GIÁ VỀ QUÁN
          </p>
        </Button>
      )}
      <ModalCreateReview
        form={form}
        isModalOpen={isModalOpen}
        handleCancel={handleCancel}
        handleOk={handleOk}
        setIsModalOpen={setIsModalOpen}
        businessId={businessId}
      />
      <LoginRequiredModal
        isModalOpen={isLoginRequiredModalOpen}
        handleCancel={handleCancelLoginRequiredModal}
      />
    </BoxContainer>
  );
};

export default CreateReview;
