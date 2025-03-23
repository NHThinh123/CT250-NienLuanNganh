import { List, Row, Col } from "antd";
import BoxContainer from "../../../../components/atoms/BoxContainer";
import "../../../../styles/global.css";
import ReviewItem from "../organisms/ReviewItem";
import ReviewFilter from "../organisms/ReviewFilter";
// import ReviewOverview from "../organisms/ReviewOverview";
import { useEffect, useState } from "react";

const ReviewList = ({ reviewData, businessId }) => {
  const [filteredReviews, setFilteredReviews] = useState(reviewData);

  const handleFilterChange = (filters) => {
    let result = [...reviewData];

    // Lọc theo mức sao trước (nếu có)
    const ratingFilters = filters
      .map((f) => parseInt(f))
      .filter((f) => !isNaN(f));
    if (ratingFilters.length > 0) {
      result = result.filter((review) =>
        ratingFilters.includes(review.review_rating)
      );
    }

    // Sắp xếp theo thời gian (nếu có "latest" hoặc "oldest")
    if (filters.includes("latest")) {
      result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (filters.includes("oldest")) {
      result.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    } else if (filters.length === 0) {
      // Nếu không có bộ lọc nào, sắp xếp theo thời gian giảm dần (mới nhất trước)
      result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    setFilteredReviews(result);
  };

  // Cập nhật filteredReviews khi reviewData thay đổi
  useEffect(() => {
    // Ban đầu sắp xếp theo thời gian giảm dần (mới nhất trước) mà không áp dụng bộ lọc
    const initialReviews = [...reviewData].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
    setFilteredReviews(initialReviews);
  }, [reviewData]);

  return (
    <>
      {" "}
      <BoxContainer>
        <div>
          {/* <ReviewOverview businessId={businessId} /> */}

          <ReviewFilter onFilterChange={handleFilterChange} />
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
    </>
  );
};

export default ReviewList;
