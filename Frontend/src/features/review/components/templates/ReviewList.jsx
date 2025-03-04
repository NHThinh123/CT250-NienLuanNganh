import { Avatar, List, Rate } from "antd";

const ReviewList = ({ reviewData }) => {
  return (
    <>
      <List
        style={{ padding: "20px 20px 0px 20px", justifyContent: "center" }}
        grid={{ gutter: 16, column: 1 }}
        pagination={{
          onChange: (page) => {
            console.log(page);
          },
          pageSize: 3,
          align: "center",
        }}
        dataSource={reviewData}
        renderItem={(review) => (
          <List.Item>
            <div style={{ display: "flex" }}>
              <Avatar src={review.user_id.avatar}></Avatar>
              <div style={{ marginLeft: 8 }}>
                <p style={{ fontWeight: "bold" }}>{review.user_id.name}</p>
                <Rate
                  allowHalf
                  defaultValue={review.review_rating}
                  disabled
                  style={{ fontSize: 15 }}
                />
              </div>
            </div>
            <p>{review.review_contents}</p>
          </List.Item>
        )}
      />
    </>
  );
};

export default ReviewList;
