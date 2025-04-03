import { CheckCircleFilled, EllipsisOutlined } from "@ant-design/icons";
import { Avatar, Button, Col, Row, Typography, Dropdown, Modal } from "antd";
import { formatTime } from "../../../../constants/formatTime";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import ModalUpdatePost from "./ModalUpdatePost";

const PostHeader = ({
  postData,
  userData,
  createAt,
  isBusiness,
  onDelete,
  isDeleting,
  post_id,
  isMyPost = false,
}) => {
  const [isModalVisible, setIsModalVisible] = useState(false); // Trạng thái Modal xóa
  const [isShowModalUpdatePost, setIsShowModalUpdatePost] = useState(false); // Trạng thái Modal cập nhật
  const [windowWidth, setWindowWidth] = useState(window.innerWidth); // Theo dõi kích thước màn hình

  // Theo dõi kích thước màn hình
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleShowModalUpdatePost = () => {
    setIsShowModalUpdatePost(true);
  };
  const handleCancelModalUpdatePost = () => {
    setIsShowModalUpdatePost(false);
  };

  // Hàm mở Modal xác nhận xóa
  const showDeleteConfirm = () => {
    setIsModalVisible(true);
  };

  // Hàm xử lý khi nhấn OK trong Modal
  const handleOk = () => {
    setIsModalVisible(false);
    if (onDelete) onDelete(post_id);
  };

  // Hàm xử lý khi nhấn Cancel hoặc đóng Modal
  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const items = [
    {
      label: (
        <Button
          type="link"
          style={{ color: "black", padding: 0 }} // Giảm padding cho mobile
          onClick={showDeleteConfirm}
          loading={isDeleting}
        >
          Xóa
        </Button>
      ),
      key: "0",
    },
    {
      label: (
        <Button
          type="link"
          style={{ color: "black", padding: 0 }} // Giảm padding cho mobile
          onClick={handleShowModalUpdatePost}
        >
          Sửa
        </Button>
      ),
      key: "1",
    },
  ];

  return (
    <>
      <Row align="middle" gutter={[8, 8]} style={{ width: "100%" }}>
        <Col
          xs={4} // Mobile: 4/24 để Avatar nhỏ hơn
          sm={3} // Tablet nhỏ: 3/24
          md={2} // Tablet lớn/Desktop: 2/24
          style={{
            textAlign: "center",
          }}
        >
          <Avatar
            size={windowWidth <= 768 ? "default" : "large"} // Responsive Avatar
            src={
              userData?.avatar ||
              "https://res.cloudinary.com/nienluan/image/upload/v1741015659/default-avatar-profile-icon-social-media-user-image-gray-avatar-icon-blank-profile-silhouette-illustration-vector_d3dgki.jpg"
            }
          />
        </Col>
        <Col
          xs={isMyPost ? 18 : 20} // Mobile: 18/24 nếu có Dropdown, 20/24 nếu không
          sm={isMyPost ? 19 : 21} // Tablet nhỏ: 19/24 hoặc 21/24
          md={isMyPost ? 20 : 22} // Tablet lớn/Desktop: 20/24 hoặc 22/24
        >
          <Typography.Title
            level={5}
            style={{
              marginBottom: 0,
              fontSize:
                windowWidth <= 576
                  ? "14px"
                  : windowWidth <= 768
                  ? "16px"
                  : "18px", // Responsive font
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {userData?.name}
            {isBusiness && (
              <Link
                style={{
                  fontSize:
                    windowWidth <= 576
                      ? "12px"
                      : windowWidth <= 768
                      ? "13px"
                      : "14px", // Responsive font
                  marginLeft: 8,
                }}
                to={`/businesses/${userData?.id}`}
              >
                <CheckCircleFilled /> - Quán ăn
              </Link>
            )}
          </Typography.Title>
          <Typography.Text
            style={{
              fontSize: windowWidth <= 576 ? "12px" : "14px", // Responsive font
            }}
          >
            {formatTime(createAt)}
          </Typography.Text>
        </Col>
        {isMyPost && (
          <Col
            xs={2} // Mobile: 2/24
            sm={2} // Tablet nhỏ: 2/24
            md={2} // Tablet lớn/Desktop: 2/24
            style={{
              textAlign: "center",
            }}
          >
            <Dropdown
              menu={{ items }}
              trigger={["click"]}
              disabled={isDeleting}
            >
              <Button
                type="text"
                loading={isDeleting}
                size={windowWidth <= 576 ? "small" : "middle"} // Responsive button size
              >
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
        okButtonProps={{ danger: true, loading: isDeleting }}
        cancelButtonProps={{ disabled: isDeleting }}
        width={windowWidth <= 576 ? "90%" : "520px"} // Responsive width cho Modal
      >
        <p>Bạn có chắc chắn muốn xóa bài viết này không?</p>
      </Modal>

      {/* Modal cập nhật bài viết */}
      {isMyPost && (
        <ModalUpdatePost
          handleCancel={handleCancelModalUpdatePost}
          isModalOpen={isShowModalUpdatePost}
          postData={postData}
          setIsModalOpen={setIsShowModalUpdatePost}
        />
      )}
    </>
  );
};

export default PostHeader;
