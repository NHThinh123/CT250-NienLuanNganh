import { Typography } from "antd";

const PostDetail = ({ postData, isLoading, isError }) => {
  if (isLoading) {
    return <Typography.Title level={2}>Loading...</Typography.Title>;
  }
  if (isError) {
    return <Typography.Title level={2}>Error...</Typography.Title>;
  }
  return (
    <>
      <Typography.Title>{postData.title}</Typography.Title>
      <Typography.Paragraph>{postData.content}</Typography.Paragraph>
    </>
  );
};

export default PostDetail;
