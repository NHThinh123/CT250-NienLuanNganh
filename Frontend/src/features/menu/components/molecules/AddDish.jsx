import { Button, Form } from "antd";
import { SquarePlus } from "lucide-react";
import { useContext, useState } from "react";
import ModalAddDish from "../atoms/ModalAddDish";
import { BusinessContext } from "../../../../contexts/business.context";

const AddDish = ({ menuData }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [hover, setHover] = useState(false); //set hover cho delete button
  const [form] = Form.useForm();

  const { business } = useContext(BusinessContext);

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
      {business.isAuthenticated &&
        business.business.id == menuData.business_id && (
          <Button
            type="link"
            onClick={showModal}
            style={{
              margin: 0,
              padding: 0,
              paddingBottom: "18px",
              border: "none",
            }}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
          >
            <SquarePlus
              strokeWidth={hover ? 2.75 : 0.75}
              color={hover ? "blue" : "blue"}
              size={25}
            />
          </Button>
        )}
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
