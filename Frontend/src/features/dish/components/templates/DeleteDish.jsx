import { Button, message, Modal, Typography } from "antd";
import { X } from "lucide-react";
import { useContext, useState } from "react";
import useDeleteDish from "../../hooks/useDeleteDish";
import { BusinessContext } from "../../../../contexts/business.context";

const DeleteDish = ({ dishName, dishId, businessId }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { mutate: deleteDish, isLoading } = useDeleteDish();
  const { business } = useContext(BusinessContext);
  const [hover, setHover] = useState(false); //set hover cho delete button
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = async () => {
    deleteDish(dishId, {
      onSuccess: () => {
        message.success(`Món ${dishName} đã được xóa thành công!`);
        setIsModalOpen(false);
      },
      onError: () => {
        message.error(`Lỗi khi xóa món ${dishName}!`);
      },
    });
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  return (
    <>
      <Modal
        title={
          <Typography.Title
            level={4}
            style={{ textAlign: "center", color: "red" }}
          >
            Xác nhận xóa
          </Typography.Title>
        }
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        okText={isLoading ? "Đang xóa..." : "Xóa"}
        cancelText="Hủy"
        maskClosable={false}
        centered
        okButtonProps={{
          style: { backgroundColor: "red", borderColor: "red" },
          onMouseEnter: (e) => {
            e.target.style.backgroundColor = "#cc0000"; // Màu đậm hơn khi hover
            e.target.style.borderColor = "#cc0000";
          },
          onMouseLeave: (e) => {
            e.target.style.backgroundColor = "red";
            e.target.style.borderColor = "red";
          },
        }}
      >
        <div
          style={{
            display: "flex",
            margin: "32px 0px",
            justifyContent: "center",
          }}
        >
          <p
            style={{
              fontSize: 16,
              marginLeft: 4,
            }}
          >
            Bạn có chắn chắn muốn xóa món{" "}
            <span style={{ fontStyle: "italic" }}>{dishName}</span>?
          </p>
        </div>
      </Modal>
      {business.isAuthenticated && business.business.id == businessId && (
        <Button
          onClick={showModal}
          type="link"
          danger
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
          <X strokeWidth={hover ? 2.75 : 0.75} color={hover ? "red" : "red"} />
        </Button>
      )}
    </>
  );
};
export default DeleteDish;
