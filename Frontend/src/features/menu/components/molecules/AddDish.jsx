import { Button, Form } from "antd";
import { SquarePlus } from "lucide-react";
import { useState } from "react";
import ModalAddDish from "../atoms/ModalAddDish";
// import { BusinessContext } from "../../../../contexts/business.context";

const AddDish = ({ menuData }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();

  // const { business } = useContext(BusinessContext);

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
      <Button type="link" onClick={showModal}>
        <SquarePlus />
      </Button>
      {/* )} */}
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
