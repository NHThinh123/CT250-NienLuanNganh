import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createReplyApi } from "../services/commentApi";
import { useContext } from "react";
import { AuthContext } from "../../../contexts/auth.context";

const useCreateReply = (comment_id) => {
  const { auth } = useContext(AuthContext);
  const userId = auth?.user?.id || null;
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createReplyApi,
    onSuccess: () => {
      queryClient.invalidateQueries("comments", comment_id, userId);
    },
  });
};

export default useCreateReply;
