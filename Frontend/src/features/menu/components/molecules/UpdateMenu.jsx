import { Button, Form } from "antd";
import { Pencil } from "lucide-react";
import { useContext, useState } from "react";
import ModalUpdateMenu from "../atoms/ModalUpdateMenu";
import { BusinessContext } from "../../../../contexts/business.context";

const UpdateMenu = ({ menuId, menuName, businessId }) => {
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
            display: "grid",
            placeItems: "center",
            height: "100%",
          }}
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
        >
          <Pencil
            strokeWidth={hover ? 2.75 : 0.75}
            color={hover ? "blue" : "blue"}
            style={{ width: 20, height: 20 }}
            size={10}
          />
        </Button>
      )}
      <ModalUpdateMenu
        form={form}
        isModalOpen={isModalOpen}
        handleOk={handleOk}
        handleCancel={handleCancel}
        setIsModalOpen={setIsModalOpen}
        menuId={menuId}
        menuName={menuName}
      />
    </>
  );
};

export default UpdateMenu;
