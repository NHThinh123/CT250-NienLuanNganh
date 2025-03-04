import { useMutation, useQueryClient } from "@tanstack/react-query";
import { likePostApi } from "../services/postApi";

const useLikePost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, post_id }) => likePostApi(id, post_id),
    onSuccess: () => {
      queryClient.invalidateQueries("posts"); // Làm mới danh sách bài viết
    },
  });
};

export default useLikePost;
