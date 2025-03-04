import { useQuery } from "@tanstack/react-query";
import { getCommentApi } from "../services/commentApi";
import { useMemo } from "react";

import { useAuthEntity } from "../../../hooks/useAuthEntry";

const useComment = (post_id, enabled) => {
  const { entity } = useAuthEntity();

  const queryKey = useMemo(
    () => ["comments", post_id, entity],
    [post_id, entity?.id]
  );

  const {
    data: commentData = [],
    isLoading: loading,
    isError,
  } = useQuery({
    queryKey,
    queryFn: () => getCommentApi(post_id, entity?.id),
    enabled,
  });

  return { commentData, loading, isError };
};

export default useComment;
