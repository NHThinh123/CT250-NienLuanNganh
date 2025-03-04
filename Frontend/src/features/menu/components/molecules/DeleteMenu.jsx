import { Button, message, Modal, Typography } from "antd";
import { SquareX, Trash2 } from "lucide-react";
import { useState } from "react";
import useDeleteMenu from "../../hooks/useDeleteMenu";

const DeleteMenu = ({ menuName, menuId }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { mutate: deleteMenu, isLoading } = useDeleteMenu();
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = async () => {
    deleteMenu(menuId, {
      onSuccess: () => {
        message.success(`Thực đơn ${menuName} đã được xóa thành công!`);
        setIsModalOpen(false);
      },
      onError: () => {
        message.error(`Lỗi khi xóa thực đơn ${menuName}!`);
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
            Bạn có chắn chắn muốn xóa thực đơn{" "}
            <span style={{ fontStyle: "italic" }}>{menuName}</span>?
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
export default DeleteMenu;
