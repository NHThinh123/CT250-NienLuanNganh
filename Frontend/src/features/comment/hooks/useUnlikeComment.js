import { useMutation, useQueryClient } from "@tanstack/react-query";
import { unlikeCommentApi } from "../services/commentApi";
import { useContext } from "react";
import { AuthContext } from "../../../contexts/auth.context";

const useUnlikeComment = (post_id) => {
  const { auth } = useContext(AuthContext);
  const userId = auth?.user?.id || null;
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ user_id, comment_id }) =>
      unlikeCommentApi(user_id, comment_id),
    onSuccess: () => {
      queryClient.invalidateQueries("comments", post_id, userId);
    },
  });
};

export default useUnlikeComment;
