import { Button, Form } from "antd";
import { SquarePlus } from "lucide-react";
import { useState } from "react";
import ModalAddDish from "../atoms/ModalAddDish";

const AddDish = ({ menuData }) => {
  console.log("menuData in addDish: ", menuData);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    form.submit();
    form.resetFields();
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    form.resetFields();
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
        form={form}
        isModalOpen={isModalOpen}
        handleCancel={handleCancel}
        handleOk={handleOk}
        setIsModalOpen={setIsModalOpen}
        menuData={menuData}
      />
    </>
  );
};

export default AddDish;
