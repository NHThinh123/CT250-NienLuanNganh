import { useQuery } from "@tanstack/react-query";
import { getPostByIdApi } from "../services/postApi";
import { useAuthEntity } from "../../../hooks/useAuthEntry";

const usePostById = (postId) => {
  const { entity } = useAuthEntity();
  const {
    data: postData = {},
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["posts", postId, entity?.id],
    queryFn: () => getPostByIdApi(postId, entity?.id),
  });

  return { postData, isLoading, isError };
};

export default usePostById;
