import { HeartFilled } from "@ant-design/icons";
import { Avatar, Button, Typography } from "antd";

const Comment = ({ commentData }) => {
  return (
    <div style={{ display: "flex", gap: "16px" }}>
      <div style={{ textAlign: "center" }}>
        <Avatar src={commentData?.user_id?.avatar}></Avatar>
      </div>
      <div>
        <div
          style={{
            backgroundColor: "#f0f2f5",
            padding: "10px",
            borderRadius: "10px",
          }}
        >
          <Typography.Text strong>{commentData?.user_id?.name}</Typography.Text>
          <br />
          <Typography.Text>{commentData?.comment_content}</Typography.Text>
        </div>
        <div style={{ display: "flex", gap: "4px" }}>
          <Button type="link" style={{ padding: "0px 4px" }}>
            <HeartFilled style={{ color: "gray" }} />
            <Typography.Text>Yêu thích</Typography.Text>
          </Button>
          <Button type="link" style={{ padding: "0px 4px" }}>
            <Typography.Text style={{ fontWeight: "normal" }}>
              Phản hồi
            </Typography.Text>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Comment;
