import { Button, Typography } from "antd";
import BoxContainer from "../../../../components/atoms/BoxContainer";
import { MessageCircleMore, ThumbsUp, UserPen } from "lucide-react";

const SearchingPostContainer = ({ listType, onChange }) => {
  const handleButtonClick = (type) => {
    if (onChange) {
      onChange(type);
    }
  };

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
            color: listType === "my-posts" ? "#52c41a" : "black",
            fontSize: "16px",
          }}
        >
          <UserPen size={20} strokeWidth={2.5} />
          Bài viết của tôi
        </Button>
        <Button
          type="text"
          onClick={() => handleButtonClick("liked-posts")}
          style={{
            width: "100%",
            marginTop: "8px",
            justifyContent: "flex-start",
            paddingTop: "20px",
            paddingBottom: "20px",
            fontWeight: "bold",
            color: listType === "liked-posts" ? "#52c41a" : "black",
            fontSize: "16px",
          }}
        >
          <ThumbsUp size={20} strokeWidth={2.5} />
          Bài viết đã thích
        </Button>
        <Button
          type="text"
          onClick={() => handleButtonClick("commented-posts")}
          style={{
            width: "100%",
            marginTop: "8px",
            justifyContent: "flex-start",
            paddingTop: "20px",
            paddingBottom: "20px",
            fontWeight: "bold",
            color: listType === "commented-posts" ? "#52c41a" : "black",
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
