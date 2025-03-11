import { CheckCircleFilled, EllipsisOutlined } from "@ant-design/icons";
import { Avatar, Button, Col, Row, Typography, Dropdown, Modal } from "antd"; // Thêm Modal
import { formatTime } from "../../../../constants/formatTime";
import { Link } from "react-router-dom";
import { useState } from "react"; // Thêm useState để quản lý trạng thái Modal

const PostHeader = ({
  userData,
  createAt,
  isBusiness,
  onDelete,
  isDeleting,
  post_id,
  isMyPost = false,
}) => {
  const [isModalVisible, setIsModalVisible] = useState(false); // Trạng thái hiển thị Modal

  // Hàm mở Modal xác nhận
  const showDeleteConfirm = () => {
    setIsModalVisible(true);
  };

  // Hàm xử lý khi nhấn OK trong Modal
  const handleOk = () => {
    setIsModalVisible(false);
    if (onDelete) onDelete(post_id); // Gọi hàm xóa với post_id
  };

  // Hàm xử lý khi nhấn Cancel hoặc đóng Modal
  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const items = [
    {
      label: (
        <Button type="text" onClick={showDeleteConfirm} loading={isDeleting}>
          Xóa
        </Button>
      ),
      key: "0",
    },
    {
      label: <Button type="text">Sửa</Button>,
      key: "1",
    },
  ];

  return (
    <>
      <Row align="middle">
        <Col span={2} style={{ textAlign: "center" }}>
          <Avatar
            size="large"
            src={
              userData?.avatar ||
              "https://res.cloudinary.com/nienluan/image/upload/v1741015659/default-avatar-profile-icon-social-media-user-image-gray-avatar-icon-blank-profile-silhouette-illustration-vector_d3dgki.jpg"
            }
          />
        </Col>
        <Col span={20}>
          <Typography.Title level={5} style={{ marginBottom: 0 }}>
            {userData?.name}
            {isBusiness && (
              <Link
                style={{ fontSize: 14, marginLeft: 8 }}
                to={`/businesses/${userData?.id}`}
              >
                <CheckCircleFilled /> - Quán ăn
              </Link>
            )}
          </Typography.Title>
          <Typography.Text>{formatTime(createAt)}</Typography.Text>
        </Col>
        {isMyPost && (
          <Col span={2} style={{ textAlign: "center" }}>
            <Dropdown
              menu={{
                items,
              }}
              trigger={["click"]}
              disabled={isDeleting}
            >
              <Button type="text" loading={isDeleting}>
                <EllipsisOutlined />
              </Button>
            </Dropdown>
          </Col>
        )}
      </Row>

      {/* Modal xác nhận xóa */}
      <Modal
        title="Xác nhận xóa bài viết"
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="Xóa"
        cancelText="Hủy"
        okButtonProps={{ danger: true, loading: isDeleting }} // Nút OK màu đỏ, hiển thị loading
        cancelButtonProps={{ disabled: isDeleting }} // Vô hiệu hóa Cancel khi đang xóa
      >
        <p>Bạn có chắc chắn muốn xóa bài viết này không?</p>
      </Modal>
    </>
  );
};

export default PostHeader;
