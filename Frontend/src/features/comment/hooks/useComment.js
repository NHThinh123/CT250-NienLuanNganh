import { useQuery } from "@tanstack/react-query";
import { getCommentApi } from "../services/commentApi";

const useComment = (post_id) => {
  const {
    data: commentData = [],
    isLoading: loading,
    isError,
  } = useQuery({
    queryKey: ["comments", post_id],
    queryFn: () => getCommentApi(post_id),
  });

  return { commentData, loading, isError };
};

export default useComment;
