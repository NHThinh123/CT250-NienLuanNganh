import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

import { getReplyCommentApi } from "../services/commentApi";
import { useAuthEntity } from "../../../hooks/useAuthEntry";

const useReplyComment = (comment_id, enabled) => {
  const { entity } = useAuthEntity();

  const queryKey = useMemo(
    () => ["replies", comment_id, entity?.id],
    [comment_id, entity?.id]
  );

  const {
    data: replyData = [],
    isLoading: loading,
    isError,
  } = useQuery({
    queryKey,
    queryFn: () => getReplyCommentApi(comment_id, entity?.id),
    enabled,
  });

  return { replyData, loading, isError };
};

export default useReplyComment;
