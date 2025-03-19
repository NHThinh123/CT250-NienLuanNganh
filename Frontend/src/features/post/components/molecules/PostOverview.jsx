import BoxContainer from "../../../../components/atoms/BoxContainer";
import { Button, Typography } from "antd";
import { AlignEndHorizontal } from "lucide-react";

const PostOverview = () => {
  return (
    <BoxContainer>
      <Typography.Title
        level={4}
        style={{ marginTop: "8px", marginLeft: "8px" }}
      >
        Tổng quan
      </Typography.Title>
      <Button
        type="text"
        href="/posts/my-posts/overview"
        style={{
          width: "100%",
          marginTop: "8px",
          justifyContent: "flex-start",
          paddingTop: "20px",
          paddingBottom: "20px",
          fontWeight: "bold",
          color: "black",
          fontSize: "16px",
        }}
      >
        <AlignEndHorizontal size={20} strokeWidth={2.5} />
        Tổng quan bài viết
      </Button>
    </BoxContainer>
  );
};

export default PostOverview;
