import { Button, message, Modal, Typography } from "antd";
import { X } from "lucide-react";
import { useContext, useState } from "react";
import useDeleteMenu from "../../hooks/useDeleteMenu";
import { BusinessContext } from "../../../../contexts/business.context";

const DeleteMenu = ({ menuName, menuId }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { mutate: deleteMenu, isLoading } = useDeleteMenu();
  const { business } = useContext(BusinessContext);
  const [hover, setHover] = useState(false); //set hover cho delete button
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
            Bạn có chắn chắn muốn xóa thực đơn{" "}
            <span style={{ fontStyle: "italic" }}>{menuName}</span>?
          </p>
        </div>
      </Modal>
      {business.isAuthenticated && (
        <Button
          onClick={showModal}
          type="link"
          danger
          style={{
            margin: 0,
            padding: 0,
            border: "none",
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
export default DeleteMenu;
