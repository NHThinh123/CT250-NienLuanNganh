import { Typography } from "antd";
import PostForm from "../features/post/components/templates/PostForm";
import { useParams } from "react-router-dom";
import usePostById from "../features/post/hooks/usePostById";

const PostEditPage = () => {
  const { id } = useParams();
  const { postData, isLoading, isError } = usePostById(id);

  if (isLoading) {
    return <Typography.Title level={2}>Loading...</Typography.Title>;
  }
  if (isError) {
    return <Typography.Title level={2}>Error...</Typography.Title>;
  }
  return (
    <>
      <Typography.Title level={2}>Sửa bài đăng</Typography.Title>
      <PostForm initialValues={postData} mode="edit" />
    </>
  );
};

export default PostEditPage;
