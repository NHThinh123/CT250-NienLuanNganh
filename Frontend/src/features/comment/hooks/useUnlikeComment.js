import { useMutation, useQueryClient } from "@tanstack/react-query";
import { unlikeCommentApi } from "../services/commentApi";

const useUnlikeComment = (post_id) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ user_id, comment_id }) =>
      unlikeCommentApi(user_id, comment_id),
    onSuccess: () => {
      queryClient.invalidateQueries("comments", post_id);
    },
  });
};

export default useUnlikeComment;
