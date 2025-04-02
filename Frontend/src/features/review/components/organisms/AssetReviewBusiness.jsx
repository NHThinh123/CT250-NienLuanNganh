import { useState, useEffect, useRef } from "react";
import { Row, Modal, Col } from "antd";
import {
  LeftOutlined,
  RightOutlined,
  VideoCameraOutlined,
  PlusOutlined,
} from "@ant-design/icons";

const AssetReviewBussiness = ({ assetReviewData }) => {
  const [visible, setVisible] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [videoDurations, setVideoDurations] = useState({});
  const [displayCount, setDisplayCount] = useState(1); // Bắt đầu với 1 để tránh lỗi
  const videoRefs = useRef({});
  const containerRef = useRef(null);

  // Lấy thời lượng video
  useEffect(() => {
    if (!assetReviewData?.length) return;

    const controller = new AbortController();
    const fetchDurations = async () => {
      const durations = {};
      const videoPromises = assetReviewData.map(async (asset, index) => {
        if (asset.type === "video") {
          return new Promise((resolve) => {
            const video = document.createElement("video");
            videoRefs.current[index] = video;
            video.src = asset.url;
            video.preload = "metadata";
            video.onloadedmetadata = () => {
              const minutes = Math.floor(video.duration / 60);
              const seconds = Math.floor(video.duration % 60);
              durations[index] = `${minutes}:${
                seconds < 10 ? "0" : ""
              }${seconds}`;
              resolve();
            };
            video.onerror = () => resolve();
          });
        }
        return Promise.resolve();
      });

      await Promise.all(videoPromises);
      setVideoDurations(durations);
    };

    fetchDurations();

    return () => {
      controller.abort();
      Object.values(videoRefs.current).forEach((video) => {
        video.onloadedmetadata = null;
        video.onerror = null;
        video.src = "";
      });
    };
  }, [assetReviewData]);

  // Tính toán số lượng phần tử hiển thị
  useEffect(() => {
    const updateDisplayCount = () => {
      if (containerRef.current && assetReviewData?.length) {
        const containerWidth = containerRef.current.offsetWidth;
        const itemWidth = 78; // 70px (kích thước ảnh/video) + 8px (gap)
        const maxItems = Math.floor(containerWidth / itemWidth);
        const newDisplayCount = Math.min(maxItems, assetReviewData.length);
        setDisplayCount(newDisplayCount > 0 ? newDisplayCount : 1); // Đảm bảo ít nhất 1 phần tử
      }
    };

    // Gọi lần đầu khi mount
    updateDisplayCount();

    // Thêm resize listener
    window.addEventListener("resize", updateDisplayCount);

    // Dọn dẹp
    return () => {
      window.removeEventListener("resize", updateDisplayCount);
    };
  }, [assetReviewData]);

  const imageCount =
    assetReviewData?.filter((asset) => asset.type === "image").length || 0;
  const videoCount =
    assetReviewData?.filter((asset) => asset.type === "video").length || 0;

  if (
    !assetReviewData ||
    !Array.isArray(assetReviewData) ||
    assetReviewData.length === 0
  ) {
    return null;
  }

  const openModal = (index) => {
    setCurrentIndex(index);
    setVisible(true);
  };

  const closeModal = () => {
    setVisible(false);
  };

  const prevMedia = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? assetReviewData.length - 1 : prevIndex - 1
    );
  };

  const nextMedia = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === assetReviewData.length - 1 ? 0 : prevIndex + 1
    );
  };

  const displayData = assetReviewData.slice(0, displayCount);
  const remainingCount = assetReviewData.length - displayCount;

  return (
    <>
      <p style={{ fontWeight: "bold", margin: 0, fontSize: 14 }}>
        Tất cả hình ảnh ({imageCount}) và video ({videoCount})
      </p>
      <Row style={{ marginTop: 8 }}>
        <div
          ref={containerRef}
          style={{
            display: "flex",
            flexWrap: "nowrap",
            gap: 8,
            width: "100%", // Đảm bảo container chiếm toàn bộ chiều rộng
          }}
        >
          {displayData.map((asset, index) => (
            <div
              key={index}
              style={{
                position: "relative",
                width: "70px",
                height: "70px",
                cursor: "pointer",
                overflow: "hidden",
                flexShrink: 0,
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
                    ...(index === displayCount - 1 && remainingCount > 0
                      ? { filter: "brightness(50%)" }
                      : {}),
                  }}
                  onError={(e) => {
                    e.target.src = "/fallback-image.jpg";
                  }}
                />
              ) : asset.type === "video" ? (
                <div style={{ position: "relative" }}>
                  <video
                    src={asset.url}
                    style={{
                      width: "70px",
                      height: "70px",
                      objectFit: "cover",
                      borderRadius: "8px",
                      ...(index === displayCount - 1 && remainingCount > 0
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
                      height: "30%",
                      background: "rgba(0, 0, 0, 0.5)",
                      borderRadius: "0 0 8px 8px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexDirection: "row",
                      color: "#fff",
                      fontSize: "12px",
                    }}
                  >
                    <VideoCameraOutlined
                      style={{ fontSize: "12px", marginRight: "4px" }}
                    />
                    <span>{videoDurations[index] || "0:00"}</span>
                  </div>
                </div>
              ) : null}

              {index === displayCount - 1 && remainingCount > 0 && (
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
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
        </div>
      </Row>
      <Row style={{ marginTop: 10 }}>
        <Col span={24}>
          <div style={{ borderTop: "1px solid #ddd", marginBottom: 10 }}></div>
        </Col>
      </Row>

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
          {assetReviewData.length > 1 && (
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

          {assetReviewData[currentIndex]?.type === "image" ? (
            <img
              src={assetReviewData[currentIndex].url}
              alt="Full view"
              style={{
                maxWidth: "100%",
                maxHeight: "80vh",
                borderRadius: "8px",
              }}
              onError={(e) => {
                e.target.src = "/fallback-image.jpg";
              }}
            />
          ) : (
            <video
              src={assetReviewData[currentIndex]?.url}
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

export default AssetReviewBussiness;
