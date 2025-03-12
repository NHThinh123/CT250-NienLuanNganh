import { Avatar, List, Rate, Typography } from "antd";
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
              <div style={{ display: "flex" }}>
                <Avatar
                  src={
                    !review.user_id && review.business_id_review
                      ? review.business_id_review.avatar
                      : review.user_id.avatar
                  }
                ></Avatar>
                <div style={{ marginLeft: 8 }}>
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
              </div>
              <Typography.Text
                style={{ marginLeft: 40, color: "#6D6F71", fontSize: 14 }}
              >
                {formatTime(review.createdAt)}
              </Typography.Text>
              <p style={{ marginLeft: 40 }}>{review.review_contents}</p>
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
