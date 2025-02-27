import { useQuery } from "@tanstack/react-query";
import { getCommentApi } from "../services/commentApi";
import { useContext, useMemo } from "react";
import { AuthContext } from "../../../contexts/auth.context";

const useComment = (post_id) => {
  const { auth } = useContext(AuthContext);
  const userId = auth?.user?.id || null;

  const queryKey = useMemo(
    () => ["comments", post_id, userId],
    [post_id, userId]
  );

  const {
    data: commentData = [],
    isLoading: loading,
    isError,
  } = useQuery({
    queryKey,
    queryFn: () => getCommentApi(post_id, userId),
    enabled: !!post_id, // Chỉ fetch nếu có post_id hợp lệ
  });

  return { commentData, loading, isError };
};

export default useComment;
