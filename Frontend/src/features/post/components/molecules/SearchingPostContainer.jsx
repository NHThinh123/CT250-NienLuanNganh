import { Button, Typography } from "antd";
import BoxContainer from "../../../../components/atoms/BoxContainer";
import { MessageCircleMore, ThumbsUp, UserPen } from "lucide-react";

const SearchingPostContainer = () => {
  return (
    <BoxContainer>
      <Typography.Title level={4} style={{ marginTop: "16px" }}>
        Phân loại
      </Typography.Title>
      <div>
        <Button
          type="text"
          href="/posts/my-posts"
          style={{
            width: "100%",
            marginTop: "8px",
            justifyContent: "flex-start",
            paddingTop: "20px",
            paddingBottom: "20px",
            fontWeight: "bold",
            fontSize: "16px",
          }}
        >
          <UserPen size={20} strokeWidth={2.5} />
          Bài viết của tôi
        </Button>
        <Button
          type="text"
          style={{
            width: "100%",
            marginTop: "8px",
            justifyContent: "flex-start",
            paddingTop: "20px",
            paddingBottom: "20px",
            fontWeight: "bold",
            fontSize: "16px",
          }}
        >
          <ThumbsUp size={20} strokeWidth={2.5} /> Bài viết đã thích
        </Button>
        <Button
          type="text"
          style={{
            width: "100%",
            marginTop: "8px",
            justifyContent: "flex-start",
            paddingTop: "20px",
            paddingBottom: "20px",
            fontWeight: "bold",
            fontSize: "16px",
          }}
        >
          <MessageCircleMore size={20} strokeWidth={2.5} />
          Bài viết đã bình luận
        </Button>
      </div>
    </BoxContainer>
  );
};

export default SearchingPostContainer;
