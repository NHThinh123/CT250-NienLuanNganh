import { Button, message, Modal, Typography } from "antd";
import { SquareX, Trash2 } from "lucide-react";
import { useState } from "react";
import useDeleteDish from "../../hooks/useDeleteDish";

const DeleteDish = ({ dishName, dishId }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { mutate: deleteDish, isLoading } = useDeleteDish();
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
          <Typography.Title level={4} style={{ textAlign: "center" }}>
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
      >
        <div
          style={{
            display: "flex",
            margin: "32px 0px",
            justifyContent: "center",
          }}
        >
          <Trash2 color="red" />
          <p
            style={{
              fontSize: 16,
              fontWeight: "bold",
              marginLeft: 4,
            }}
          >
            Bạn có chắn chắn muốn xóa món{" "}
            <span style={{ fontStyle: "italic" }}>{dishName}</span>?
          </p>
        </div>
      </Modal>
      <Button
        onClick={showModal}
        type="link"
        danger
        style={{
          margin: 0,
          padding: 0,
          border: "none",
          display: "flex-box",
          placeItems: "center",
          height: "100%",
        }}
      >
        <SquareX />
      </Button>
    </>
  );
};
export default DeleteDish;
