import { useState, useEffect, useRef } from "react";
import { Row, Modal } from "antd";
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
  const videoRefs = useRef({});

  useEffect(() => {
    if (!assetReviewData?.length) return;

    const controller = new AbortController();
    const fetchDurations = async () => {
      const durations = {};
      const videoPromises = assetReviewData
        .slice(0, 5)
        .map(async (asset, index) => {
          if (asset.type === "video" && index < 5) {
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

  const imageCount =
    assetReviewData?.filter((asset) => asset.type === "image").length || 0;
  const videoCount =
    assetReviewData?.filter((asset) => asset.type === "video").length || 0;

  if (
    !assetReviewData ||
    !Array.isArray(assetReviewData) ||
    assetReviewData.length === 0
  ) {
    return (
      <div
        style={{
          padding: "20px",
          fontSize: "16px",
          color: "#888",
          textAlign: "center",
        }}
      >
        Không có nội dung media để hiển thị!
      </div>
    );
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

  const displayData = assetReviewData.slice(0, 5); // Chỉ lấy 5 phần tử đầu tiên
  const remainingCount = assetReviewData.length - 5; // Số phần tử còn lại

  return (
    <>
      <p style={{ fontWeight: "bold", margin: 0, fontSize: 14 }}>
        Tất cả hình ảnh ({imageCount}) và video ({videoCount})
      </p>
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
                  ...(index === 4 && remainingCount > 0
                    ? { filter: "brightness(50%)" }
                    : {}),
                }}
                onError={(e) => {
                  e.target.src = "/fallback-image.jpg";
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
                    ...(index === 4 && remainingCount > 0
                      ? { filter: "brightness(50%)" }
                      : {}),
                  }}
                  muted
                />
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
                    flexDirection: "column",
                    color: "#fff",
                    fontSize: "12px",
                  }}
                >
                  <VideoCameraOutlined
                    style={{ fontSize: "16px", marginBottom: 2 }}
                  />
                  {videoDurations[index] || "0:00"}
                </div>
              </div>
            ) : null}

            {/* Overlay cho phần tử thứ 5 nếu còn phần tử khác */}
            {index === 4 && remainingCount > 0 && (
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
