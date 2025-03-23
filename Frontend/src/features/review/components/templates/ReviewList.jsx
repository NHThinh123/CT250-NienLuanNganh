import { List, Row, Col } from "antd";
import BoxContainer from "../../../../components/atoms/BoxContainer";
import "../../../../styles/global.css";
import ReviewItem from "../organisms/ReviewItem";

const ReviewList = ({ reviewData, businessId }) => {
  return (
    <>
      {" "}
      <BoxContainer>
        {reviewData.length > 0 ? (
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
              showLessItems: reviewData.length > 12,
            }}
            dataSource={reviewData}
            renderItem={(review) => (
              <List.Item>
                <ReviewItem review={review} businessId={businessId} />
                <Row>
                  <Col span={24}>
                    <div style={{ borderTop: "1px solid #ddd" }}></div>
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
            }}
          >
            Chưa có đánh giá!
          </div>
        )}
      </BoxContainer>
    </>
  );
};

export default ReviewList;
