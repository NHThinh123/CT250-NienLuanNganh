import { Avatar, List, Rate, Typography, Row, Col } from "antd";
import { formatTime } from "../../../../constants/formatTime";
import BoxContainer from "../../../../components/atoms/BoxContainer";

const ReviewList = ({ reviewData }) => {
  return (
    <BoxContainer>
      {reviewData.length > 0 ? (
        <List
          style={{ padding: 10, justifyContent: "center" }}
          grid={{ gutter: 16, column: 1 }}
          pagination={{
            size: "large",
            onChange: (page) => {
              console.log(page);
            },
            pageSize: 4,
            align: "center",
            style: { marginTop: "-16px" },
            showSizeChanger: false,
            showLessItems: reviewData.length > 12,
          }}
          dataSource={reviewData}
          renderItem={(review) => (
            <List.Item>
              <Row>
                <Col span={3}>
                  {/* <div style={{ display: "flex" }}> */}
                  <Avatar
                    src={
                      !review.user_id && review.business_id_review
                        ? review.business_id_review.avatar
                        : review.user_id.avatar ||
                          "https://res.cloudinary.com/nienluan/image/upload/v1741015659/default-avatar-profile-icon-social-media-user-image-gray-avatar-icon-blank-profile-silhouette-illustration-vector_d3dgki.jpg"
                    }
                    size={35}
                  />
                </Col>
                <Col span={21}>
                  <div>
                    <p style={{ fontWeight: "bold", margin: 0 }}>
                      {!review.user_id && review.business_id_review
                        ? review.business_id_review.business_name
                        : review.user_id.name}
                    </p>
                    <Rate
                      value={review.review_rating}
                      disabled
                      style={{ fontSize: 15 }}
                    />
                  </div>
                  {/* </div> */}
                  <Typography.Text style={{ color: "#6D6F71", fontSize: 14 }}>
                    {formatTime(review.createdAt)}
                  </Typography.Text>
                  <p>{review.review_contents}</p>
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
  );
};

export default ReviewList;
