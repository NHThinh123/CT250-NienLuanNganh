import { useParams } from "react-router-dom";
import usePostById from "../features/post/hooks/usePostById";
import PostDetail from "../features/post/components/templates/PostDetail";

const PostDetailPage = () => {
  const { id } = useParams();
  const { postData, isLoading, isError } = usePostById(id);
  console.log(postData, isLoading, isError);
  return (
    <PostDetail postData={postData} isLoading={isLoading} isError={isError} />
  );
};

export default PostDetailPage;
