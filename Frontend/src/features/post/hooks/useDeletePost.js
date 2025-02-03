import { useMutation, useQueryClient } from "@tanstack/react-query";

import { deletePostApi } from "../services/postApi";

const useDeletePost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => deletePostApi(id),
    onSuccess: () => {
      queryClient.invalidateQueries("posts"); // Làm mới danh sách bài viết
    },
  });
};

export default useDeletePost;
