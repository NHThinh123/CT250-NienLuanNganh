import { Avatar, List, Rate, Typography } from "antd";
import { formatTime } from "../../../../constants/formatTime";

const ReviewList = ({ reviewData }) => {
  return (
    <>
      <List
        style={{ padding: "20px 10px 0px 10px", justifyContent: "center" }}
        grid={{ gutter: 16, column: 1 }}
        pagination={{
          size: "small",
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
            <div style={{ display: "flex" }}>
              <Avatar src={review.user_id.avatar}></Avatar>
              <div style={{ marginLeft: 8 }}>
                <p style={{ fontWeight: "bold" }}>{review.user_id.name}</p>
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
    </>
  );
};

export default ReviewList;
