import { useMutation, useQueryClient } from "@tanstack/react-query";
import { unlikePostApi } from "../services/postApi";

const useUnlikePost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ user_id, post_id }) => unlikePostApi(user_id, post_id),
    onSuccess: () => {
      queryClient.invalidateQueries("posts"); // Làm mới danh sách bài viết
    },
  });
};

export default useUnlikePost;
