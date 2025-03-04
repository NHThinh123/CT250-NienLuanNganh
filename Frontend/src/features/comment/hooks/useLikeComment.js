import { useMutation, useQueryClient } from "@tanstack/react-query";
import { likeCommentApi } from "../services/commentApi";

import { useAuthEntity } from "../../../hooks/useAuthEntry";

const useLikeComment = (post_id) => {
  const { entity } = useAuthEntity();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, comment_id }) => likeCommentApi(id, comment_id),
    onSuccess: () => {
      queryClient.invalidateQueries("comments", post_id, entity?.id);
    },
  });
};

export default useLikeComment;
