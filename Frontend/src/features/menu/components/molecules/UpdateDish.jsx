import { Button } from "antd";
import { Pencil } from "lucide-react";
import { useContext, useState } from "react";
import ModalUpdateDish from "../atoms/ModalUpdateDish";
import { BusinessContext } from "../../../../contexts/business.context";
import useDishByMenuId from "../../../dish/hooks/useDishByMenuId";

const UpdateDish = ({ dishId, businessId }) => {
  const dishData = useDishByMenuId(dishId);
  const [hover, setHover] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { business } = useContext(BusinessContext);

  const showModal = () => setIsModalOpen(true);
  const handleCancel = () => setIsModalOpen(false);

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
        isModalOpen={isModalOpen}
        handleCancel={handleCancel}
        dishData={dishData}
      />
    </>
  );
};

export default UpdateDish;
