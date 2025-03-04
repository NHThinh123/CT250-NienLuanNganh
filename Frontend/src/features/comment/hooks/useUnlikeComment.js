import { useMutation, useQueryClient } from "@tanstack/react-query";
import { unlikeCommentApi } from "../services/commentApi";

import { useAuthEntity } from "../../../hooks/useAuthEntry";

const useUnlikeComment = (post_id) => {
  const { entity } = useAuthEntity();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, comment_id }) => unlikeCommentApi(id, comment_id),
    onSuccess: () => {
      queryClient.invalidateQueries("comments", post_id, entity?.id);
    },
  });
};

export default useUnlikeComment;
