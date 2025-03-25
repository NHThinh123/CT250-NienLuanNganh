import { List, Row, Col, Flex } from "antd";
import BoxContainer from "../../../../components/atoms/BoxContainer";
import "../../../../styles/global.css";
import ReviewItem from "../organisms/ReviewItem";
import ReviewFilter from "../organisms/ReviewFilter";
import ReviewOverview from "../organisms/ReviewOverview";
import { useEffect, useState } from "react";
import AssetReviewBussiness from "../organisms/AssetReviewBusiness";
import useAssetReviewByBusinessId from "../../hooks/useAssetReviewByBusinessId";

const ReviewList = ({ reviewData, businessId }) => {
  const { assetReviewData: rawAssetReviewData } =
    useAssetReviewByBusinessId(businessId);
  const [assetReviewData, setAssetReviewData] = useState(null);
  const [filteredReviews, setFilteredReviews] = useState(reviewData);

  useEffect(() => {
    if (rawAssetReviewData && rawAssetReviewData.length > 0) {
      setAssetReviewData(rawAssetReviewData);
    } else {
      setAssetReviewData(null);
    }
  }, [rawAssetReviewData]);

  const handleFilterChange = (filters) => {
    let result = [...reviewData];

    // Lọc theo mức sao
    const ratingFilters = filters
      .map((f) => parseInt(f))
      .filter((f) => !isNaN(f));
    if (ratingFilters.length > 0) {
      result = result.filter((review) =>
        ratingFilters.includes(review.review_rating)
      );
    }

    // Lọc theo "Có hình ảnh/video"
    if (filters.includes("hasMedia")) {
      result = result.filter((review) =>
        rawAssetReviewData?.some((asset) => asset.review_id === review._id)
      );
    }

    // Lọc theo "Có bình luận"
    if (filters.includes("hasComment")) {
      result = result.filter(
        (review) =>
          review.review_contents && review.review_contents.trim() !== ""
      );
    }

    // Sắp xếp theo thời gian
    if (filters.includes("latest")) {
      result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (filters.includes("oldest")) {
      result.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    } else if (filters.length === 0) {
      result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    setFilteredReviews(result);
  };

  // Cập nhật filteredReviews khi reviewData thay đổi
  useEffect(() => {
    const initialReviews = [...reviewData].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
    setFilteredReviews(initialReviews);
  }, [reviewData]);

  return (
    <BoxContainer>
      <div>
        <Flex style={{ display: "flex", alignItems: "stretch" }} gap={16}>
          <div style={{ flex: 1 }}>
            <ReviewOverview businessId={businessId} />
          </div>
          <div style={{ width: "1px", backgroundColor: "#ddd" }}></div>
          <div style={{ flex: 1 }}>
            <ReviewFilter onFilterChange={handleFilterChange} />
          </div>
        </Flex>
        <Row>
          <Col span={24}>
            <div
              style={{ borderTop: "1px solid #ddd", marginBottom: 10 }}
            ></div>
          </Col>
        </Row>
      </div>
      <div>
        <AssetReviewBussiness assetReviewData={assetReviewData} />
      </div>
      {filteredReviews.length > 0 ? (
        <List
          style={{ padding: 5, justifyContent: "center" }}
          grid={{ gutter: 16, column: 1 }}
          pagination={{
            size: "large",
            onChange: (page) => {
              console.log(page);
            },
            pageSize: 3,
            align: "center",
            style: { marginTop: "-16px" },
            showSizeChanger: false,
            showLessItems: filteredReviews.length > 12,
          }}
          dataSource={filteredReviews}
          renderItem={(review) => (
            <List.Item>
              <ReviewItem review={review} businessId={businessId} />
              <Row>
                <Col span={24}>
                  <div
                    style={{ borderTop: "1px solid #ddd", marginTop: 5 }}
                  ></div>
                </Col>
              </Row>
            </List.Item>
          )}
        />
      ) : (
        <div
          style={{
            placeContent: "center",
            padding: "20px",
            fontSize: "16px",
            color: "#888",
            display: "flex",
            textAlign: "center",
          }}
        >
          Không có đánh giá phù hợp với bộ lọc mà bạn chọn!
        </div>
      )}
      {reviewData.length === 0 && (
        <div
          style={{
            placeContent: "center",
            padding: "20px",
            fontSize: "16px",
            color: "#888",
            display: "flex",
            textAlign: "center",
          }}
        >
          Chưa có đánh giá nào!
        </div>
      )}
    </BoxContainer>
  );
};

export default ReviewList;
