// ReviewMedia.jsx
import { Row } from "antd";

const ReviewMedia = ({ assetReviewData }) => {
  // Kiểm tra nếu assetReviewData không tồn tại hoặc không phải là mảng
  if (
    !assetReviewData ||
    !Array.isArray(assetReviewData) ||
    assetReviewData.length === 0
  ) {
    return null;
  }

  return (
    <Row style={{ marginTop: 8, overflowX: "auto", whiteSpace: "nowrap" }}>
      {assetReviewData.map((asset, index) => (
        <div
          key={index}
          style={{
            display: "inline-block",
            marginRight: 8,
          }}
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
              }}
            />
          ) : asset.type === "video" ? (
            <video
              src={asset.url}
              controls
              style={{
                width: "100px",
                height: "100px",
                objectFit: "cover",
                borderRadius: "8px",
              }}
            />
          ) : null}
        </div>
      ))}
    </Row>
  );
};

export default ReviewMedia;
