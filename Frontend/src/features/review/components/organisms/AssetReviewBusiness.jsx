import { Row, Col } from "antd";

const AssetReviewBussiness = ({ assetReviewData }) => {
  // Kiểm tra nếu assetReviewData không tồn tại hoặc không phải mảng
  if (!assetReviewData || !Array.isArray(assetReviewData)) {
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

  // Lọc các asset có type là image hoặc video
  const mediaAssets = assetReviewData.filter(
    (asset) => asset.type === "image" || asset.type === "video"
  );

  // Đếm số lượng hình ảnh và video
  const imageCount = mediaAssets.filter(
    (asset) => asset.type === "image"
  ).length;
  const videoCount = mediaAssets.filter(
    (asset) => asset.type === "video"
  ).length;

  return (
    <div style={{ padding: "10px 0" }}>
      <p style={{ fontWeight: "bold", margin: 0, fontSize: 14 }}>
        Tất cả hình ảnh ({imageCount}) và video ({videoCount})
      </p>
      {mediaAssets.length > 0 ? (
        <Row gutter={[16, 16]}>
          {mediaAssets.map((asset, index) => (
            <Col key={index} xs={24} sm={12} md={8} lg={6}>
              {asset.type === "image" ? (
                <div
                  style={{
                    width: "100%",
                    paddingTop: "100%", // Tạo tỷ lệ 1:1 (hình vuông)
                    position: "relative",
                  }}
                >
                  <img
                    src={asset.url}
                    alt={`Review asset ${index}`}
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "70px",
                      height: "70px",
                      objectFit: "cover", // Đảm bảo hình ảnh lấp đầy khung vuông
                      borderRadius: "8px",
                    }}
                  />
                </div>
              ) : (
                <div
                  style={{
                    width: "100%",
                    paddingTop: "100%", // Tạo tỷ lệ 1:1 (hình vuông)
                    position: "relative",
                  }}
                >
                  <video
                    controls
                    src={asset.url}
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: "100%",
                      objectFit: "cover", // Đảm bảo video lấp đầy khung vuông
                      borderRadius: "8px",
                    }}
                  >
                    Your browser does not support the video tag.
                  </video>
                </div>
              )}
            </Col>
          ))}
        </Row>
      ) : (
        <div
          style={{
            padding: "20px",
            fontSize: "16px",
            color: "#888",
            textAlign: "center",
          }}
        >
          Không có hình ảnh hoặc video để hiển thị!
        </div>
      )}
    </div>
  );
};

export default AssetReviewBussiness;
