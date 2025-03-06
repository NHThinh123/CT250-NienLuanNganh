import { Button, Form } from "antd";
import { useState } from "react";
import ModalCreateReview from "../organisms/ModalCreateReview";

const CreateReview = ({ businessId }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
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

  return (
    <>
      {/* {business.isAuthenticated && ( */}
      <Button
        type="link"
        onClick={showModal}
        style={{
          margin: 4,
          cursor: "pointer",
          border: "none",
          fontSize: 13,
          width: "calc(100% - 8px)",
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
      {/* )} */}
      <ModalCreateReview
        form={form}
        isModalOpen={isModalOpen}
        handleCancel={handleCancel}
        handleOk={handleOk}
        setIsModalOpen={setIsModalOpen}
        businessId={businessId}
      />
    </>
  );
};

export default CreateReview;
