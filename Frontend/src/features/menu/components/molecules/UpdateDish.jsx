import { Button, Form } from "antd";
import { Pencil } from "lucide-react";
import { useContext, useState } from "react";
import ModalUpdateDish from "../atoms/ModalUpdateDish";
import { BusinessContext } from "../../../../contexts/business.context";
import useDishById from "../../../dish/hooks/useDishById";

const UpdateDish = ({ dishId, businessId }) => {
  const dishData = useDishById(dishId);
  const [hover, setHover] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();

  const { business } = useContext(BusinessContext);

  const showModal = () => setIsModalOpen(true);
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
      {business.isAuthenticated && business.business.id == businessId && (
        <Button
          type="link"
          onClick={showModal}
          style={{
            margin: 0,
            padding: 0,
            border: "none",
          }}
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
        >
          <Pencil
            size={20}
            strokeWidth={hover ? 2.75 : 0.75}
            color={hover ? "blue" : "blue"}
          />
        </Button>
      )}
      <ModalUpdateDish
        form={form}
        isModalOpen={isModalOpen}
        handleOk={handleOk}
        handleCancel={handleCancel}
        setIsModalOpen={setIsModalOpen}
        dishData={dishData.dishData}
      />
    </>
  );
};

export default UpdateDish;
