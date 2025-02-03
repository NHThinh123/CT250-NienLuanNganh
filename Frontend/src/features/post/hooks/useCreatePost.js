import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createPostApi } from "../services/postApi";

const useCreatePost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createPostApi,
    onSuccess: () => {
      queryClient.invalidateQueries("posts"); // Làm mới danh sách bài viết
    },
  });
};

export default useCreatePost;
