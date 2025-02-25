import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createCommentApi } from "../services/commentApi";

const useCreateComment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createCommentApi,
    onSuccess: () => {
      queryClient.invalidateQueries("posts"); // Làm mới danh sách bài viết
    },
  });
};

export default useCreateComment;
