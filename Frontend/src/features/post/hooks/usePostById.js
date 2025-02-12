import { useQuery } from "@tanstack/react-query";
import { getPostByIdApi } from "../services/postApi";

const usePostById = (postId) => {
  const {
    data: postData = {},
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["posts", postId],
    queryFn: () => getPostByIdApi(postId),
  });

  return { postData, isLoading, isError };
};

export default usePostById;
