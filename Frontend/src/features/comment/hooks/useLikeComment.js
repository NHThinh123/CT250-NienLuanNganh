import { useMutation, useQueryClient } from "@tanstack/react-query";
import { likeCommentApi } from "../services/commentApi";
import { useContext } from "react";
import { AuthContext } from "../../../contexts/auth.context";

const useLikeComment = (post_id) => {
  const { auth } = useContext(AuthContext);
  const userId = auth?.user?.id || null;
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ user_id, comment_id }) =>
      likeCommentApi(user_id, comment_id),
    onSuccess: () => {
      queryClient.invalidateQueries("comments", post_id, userId);
    },
  });
};

export default useLikeComment;
