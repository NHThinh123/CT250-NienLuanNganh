import { useMutation, useQueryClient } from "@tanstack/react-query";
import { likeCommentApi } from "../services/commentApi";

const useLikeComment = (post_id) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ user_id, comment_id }) =>
      likeCommentApi(user_id, comment_id),
    onSuccess: () => {
      queryClient.invalidateQueries("comments", post_id);
    },
  });
};

export default useLikeComment;
