import { Button, Form } from "antd";
import { SquarePlus } from "lucide-react";
import { useContext, useState } from "react";
import ModalAddMenu from "../atoms/ModalAddMenu";
import { BusinessContext } from "../../../../contexts/business.context";
import BoxContainer from "../../../../components/atoms/BoxContainer";

const AddMenu = ({ businessId }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
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
    <BoxContainer>
      {business.isAuthenticated && business.business.id == businessId && (
        <Button
          type="link"
          onClick={showModal}
          style={{
            cursor: "pointer",
            border: "none",
            fontSize: 13,
            width: "100%",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "#CDE5FF";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "#FFFFFF";
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <SquarePlus strokeWidth={1} style={{ color: "#1677FF" }} />
            <p
              style={{
                margin: 2,
                fontWeight: "bold",
                color: "#1677FF",
              }}
            >
              THÊM THỰC ĐƠN
            </p>
          </div>
        </Button>
      )}
      <ModalAddMenu
        form={form}
        isModalOpen={isModalOpen}
        handleCancel={handleCancel}
        handleOk={handleOk}
        setIsModalOpen={setIsModalOpen}
        businessId={businessId}
      />
    </BoxContainer>
  );
};

export default AddMenu;
