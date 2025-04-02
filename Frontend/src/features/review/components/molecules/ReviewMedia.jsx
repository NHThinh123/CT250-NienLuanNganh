import { useState, useEffect, useRef } from "react";
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
  const [videoDurations, setVideoDurations] = useState({});
  const videoRefs = useRef({});

  useEffect(() => {
    if (!assetReviewData?.length) {
      //console.log("No assetReviewData provided or empty");
      return;
    }

    //console.log("Received assetReviewData:", assetReviewData);

    // Cleanup để tránh memory leak
    return () => {
      Object.values(videoRefs.current).forEach((video) => {
        if (video) {
          video.onloadedmetadata = null;
          video.onerror = null;
        }
      });
    };
  }, [assetReviewData]);

  if (
    !assetReviewData ||
    !Array.isArray(assetReviewData) ||
    assetReviewData.length === 0
  ) {
    //console.log("Returning null due to invalid assetReviewData");
    return null;
  }

  const sortedData = [...assetReviewData].sort((a, b) => {
    if (a.type === "video" && b.type !== "video") return -1;
    if (a.type !== "video" && b.type === "video") return 1;
    return 0;
  });

  const displayData = sortedData.slice(0, 4);
  const remainingCount = sortedData.length - 4;

  const openModal = (index) => {
    const realIndex = sortedData.findIndex(
      (item) => item.url === displayData[index].url
    );
    setCurrentIndex(realIndex);
    setVisible(true);
  };

  const closeModal = () => setVisible(false);

  const prevMedia = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? sortedData.length - 1 : prevIndex - 1
    );
  };

  const nextMedia = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === sortedData.length - 1 ? 0 : prevIndex + 1
    );
  };

  const handleMetadataLoaded = (index, duration) => {
    if (duration && !isNaN(duration) && duration > 0) {
      const minutes = Math.floor(duration / 60);
      const seconds = Math.floor(duration % 60);
      const formattedDuration = `${minutes}:${
        seconds < 10 ? "0" : ""
      }${seconds}`;
      //console.log(`Duration set for index ${index}: ${formattedDuration}`);
      setVideoDurations((prev) => ({ ...prev, [index]: formattedDuration }));
    } else {
      //console.log(`Invalid duration for index ${index}: ${duration}`);
      setVideoDurations((prev) => ({ ...prev, [index]: "0:00" }));
    }
  };

  return (
    <>
      <Row style={{ marginTop: 8, overflowX: "auto", whiteSpace: "nowrap" }}>
        {displayData.map((asset, index) => (
          <div
            key={index}
            style={{
              position: "relative",
              display: "inline-block",
              width: "70px",
              height: "70px",
              marginRight: 8,
              marginBottom: 8,
              cursor: "pointer",
              overflow: "hidden",
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
                  ref={(el) => {
                    videoRefs.current[index] = el;
                    if (el && !videoDurations[index]) {
                      el.onloadedmetadata = () => {
                        // console.log(
                        //   `Metadata loaded for ${asset.url}: duration = ${el.duration}`
                        // );
                        handleMetadataLoaded(index, el.duration);
                      };
                      el.onerror = (e) => {
                        console.error(`Error loading video ${asset.url}:`, e);
                        setVideoDurations((prev) => ({
                          ...prev,
                          [index]: "0:00",
                        }));
                      };
                    }
                  }}
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
                  preload="metadata"
                />
                <div
                  style={{
                    position: "absolute",
                    bottom: 8,
                    left: 0,
                    width: "100%",
                    height: "20px",
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
                  <VideoCameraOutlined
                    style={{ fontSize: "12px", marginRight: "4px" }}
                  />
                  <span>{videoDurations[index] || "0:00"}</span>
                </div>
              </div>
            ) : null}

            {index === 3 && remainingCount > 0 && (
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
