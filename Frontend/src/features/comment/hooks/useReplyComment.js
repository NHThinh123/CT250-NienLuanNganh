import { useQuery } from "@tanstack/react-query";
import { useContext, useMemo } from "react";
import { AuthContext } from "../../../contexts/auth.context";
import { getReplyCommentApi } from "../services/commentApi";

const useReplyComment = (comment_id, enabled) => {
  const { auth } = useContext(AuthContext);
  const userId = auth?.user?.id || null;

  const queryKey = useMemo(
    () => ["replies", comment_id, userId],
    [comment_id, userId]
  );

  const {
    data: replyData = [],
    isLoading: loading,
    isError,
  } = useQuery({
    queryKey,
    queryFn: () => getReplyCommentApi(comment_id, userId),
    enabled,
  });

  return { replyData, loading, isError };
};

export default useReplyComment;
