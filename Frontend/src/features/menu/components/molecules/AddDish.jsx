import { Button, Modal } from "antd";
import { SquarePlus } from "lucide-react";
import { useState } from "react";
import ModalAddDish from "../atoms/ModalAddDish";

const AddDish = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  // const [form] = Form.useForm();
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    // form.submit();
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    // form.resetFields();
    setIsModalOpen(false);
  };

  //   const showLoginRequiredModal = () => {
  //     setIsLoginRequiredModalOpen(true);
  //   };

  //   const handleCancelLoginRequiredModal = () => {
  //     setIsLoginRequiredModalOpen(false);
  //   };
  // const handleAction = (action) => {
  //   // if (!user_id) {
  //   //   showLoginRequiredModal();
  //   // } else {
  //   action();
  //   // }
  // };
  return (
    <>
      <Button type="link" onClick={showModal}>
        <SquarePlus />
      </Button>
      <ModalAddDish
        // form={form}
        isModalOpen={isModalOpen}
        handleCancel={handleCancel}
        handleOk={handleOk}
        // setIsModalOpen={setIsModalOpen}
      />
      {/* <Modal
        title="Basic Modal"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <p>Some contents...</p>
        <p>Some contents...</p>
        <p>Some contents...</p>
      </Modal> */}
    </>
  );
};

export default AddDish;
