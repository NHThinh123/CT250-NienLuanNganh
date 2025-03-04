import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createReplyApi } from "../services/commentApi";

import { useAuthEntity } from "../../../hooks/useAuthEntry";

const useCreateReply = (comment_id) => {
  const { entity } = useAuthEntity();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createReplyApi,
    onSuccess: () => {
      queryClient.invalidateQueries("comments", comment_id, entity?.id);
    },
  });
};

export default useCreateReply;
