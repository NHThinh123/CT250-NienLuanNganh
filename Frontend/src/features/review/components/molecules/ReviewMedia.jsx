import { useState } from "react";
import { Row, Modal } from "antd";
import {
  LeftOutlined,
  RightOutlined,
  VideoCameraOutlined,
  PlusOutlined,
} from "@ant-design/icons";

const ReviewMedia = ({ assetReviewData }) => {
  const [visible, setVisible] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  if (
    !assetReviewData ||
    !Array.isArray(assetReviewData) ||
    assetReviewData.length === 0
  ) {
    return null;
  }

  // Sắp xếp dữ liệu: ưu tiên video lên đầu
  const sortedData = [...assetReviewData].sort((a, b) => {
    if (a.type === "video" && b.type !== "video") return -1;
    if (a.type !== "video" && b.type === "video") return 1;
    return 0;
  });

  // Chỉ lấy 4 phần tử đầu tiên
  const displayData = sortedData.slice(0, 4);
  const remainingCount = sortedData.length - 4;

  // Xử lý khi mở modal
  const openModal = (index) => {
    const realIndex = sortedData.findIndex(
      (item) => item.url === displayData[index].url
    );
    setCurrentIndex(realIndex);
    setVisible(true);
  };

  // Xử lý khi đóng modal
  const closeModal = () => {
    setVisible(false);
  };

  // Chuyển về media trước đó
  const prevMedia = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? sortedData.length - 1 : prevIndex - 1
    );
  };

  // Chuyển đến media tiếp theo
  const nextMedia = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === sortedData.length - 1 ? 0 : prevIndex + 1
    );
  };

  return (
    <>
      {/* Hiển thị danh sách thumbnail */}
      <Row style={{ marginTop: 8, overflowX: "auto", whiteSpace: "nowrap" }}>
        {displayData.map((asset, index) => (
          <div
            key={index}
            style={{
              position: "relative",
              display: "inline-block",
              marginRight: 8,
              cursor: "pointer",
            }}
            onClick={() => openModal(index)}
          >
            {asset.type === "image" ? (
              <img
                src={asset.url}
                alt={`Review media ${index + 1}`}
                style={{
                  width: "70px",
                  height: "70px",
                  objectFit: "cover",
                  borderRadius: "8px",
                  ...(index === 3 && remainingCount > 0
                    ? { filter: "brightness(50%)" }
                    : {}),
                }}
              />
            ) : asset.type === "video" ? (
              <div style={{ position: "relative", display: "inline-block" }}>
                <video
                  src={asset.url}
                  style={{
                    width: "70px",
                    height: "70px",
                    objectFit: "cover",
                    borderRadius: "8px",
                    ...(index === 3 && remainingCount > 0
                      ? { filter: "brightness(50%)" }
                      : {}),
                  }}
                  muted
                />
                <div
                  style={{
                    position: "absolute",
                    bottom: 8,
                    left: 0,
                    width: "100%",
                    height: "20px", // Chỉ chiếm một phần nhỏ ở dưới
                    background: "rgba(0, 0, 0, 0.5)",
                    borderBottomLeftRadius: "8px",
                    borderBottomRightRadius: "8px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#fff",
                    fontSize: "12px",
                  }}
                >
                  <VideoCameraOutlined style={{ fontSize: "12px" }} />
                </div>
              </div>
            ) : null}

            {/* Overlay cho phần tử thứ 4 nếu còn phần tử khác */}
            {index === 3 && remainingCount > 0 && (
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "90%",
                  background: "rgba(0, 0, 0, 0.5)",
                  borderRadius: "8px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#fff",
                  fontSize: "16px",
                }}
              >
                <PlusOutlined style={{ marginRight: 4 }} />
                {remainingCount}
              </div>
            )}
          </div>
        ))}
      </Row>

      {/* Modal hiển thị media */}
      <Modal
        open={visible}
        footer={null}
        onCancel={closeModal}
        centered
        width={800}
        destroyOnClose
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
          }}
        >
          {/* Nút điều hướng nằm ngoài media */}
          {sortedData.length > 1 && (
            <>
              <div
                onClick={prevMedia}
                style={{
                  position: "absolute",
                  left: -50,
                  top: "50%",
                  transform: "translateY(-50%)",
                  fontSize: 24,
                  color: "#333",
                  cursor: "pointer",
                  background: "rgba(255, 255, 255, 0.8)",
                  padding: 10,
                  borderRadius: "50%",
                  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.2)",
                }}
              >
                <LeftOutlined />
              </div>
              <div
                onClick={nextMedia}
                style={{
                  position: "absolute",
                  right: -50,
                  top: "50%",
                  transform: "translateY(-50%)",
                  fontSize: 24,
                  color: "#333",
                  cursor: "pointer",
                  background: "rgba(255, 255, 255, 0.8)",
                  padding: 10,
                  borderRadius: "50%",
                  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.2)",
                }}
              >
                <RightOutlined />
              </div>
            </>
          )}

          {/* Hiển thị ảnh hoặc video trong modal */}
          {sortedData[currentIndex]?.type === "image" ? (
            <img
              src={sortedData[currentIndex].url}
              alt="Full view"
              style={{
                maxWidth: "100%",
                maxHeight: "80vh",
                borderRadius: "8px",
              }}
            />
          ) : (
            <video
              src={sortedData[currentIndex]?.url}
              controls
              autoPlay
              muted
              style={{
                maxWidth: "100%",
                maxHeight: "80vh",
                borderRadius: "8px",
              }}
            />
          )}
        </div>
      </Modal>
    </>
  );
};

export default ReviewMedia;
