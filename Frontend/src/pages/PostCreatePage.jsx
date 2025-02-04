import { Typography } from "antd";
import PostForm from "../features/post/components/templates/PostForm";

const PostCreatePage = () => {
  return (
    <>
      <Typography.Title level={2}>Tạo bài đăng</Typography.Title>
      <PostForm />
    </>
  );
};

export default PostCreatePage;
