import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updatePostApi } from "../services/postApi";

const useUpdatePost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => updatePostApi(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries("posts"); // Làm mới danh sách bài viết
    },
  });
};

export default useUpdatePost;
