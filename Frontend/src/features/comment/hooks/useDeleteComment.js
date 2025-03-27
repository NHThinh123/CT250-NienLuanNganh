import { useMutation, useQueryClient } from "@tanstack/react-query";

import { message } from "antd";
import { deleteCommentApi } from "../services/commentApi";

const useDeleteComment = (post_id) => {
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: (comment_id) => deleteCommentApi(comment_id),
    onSuccess: () => {
      message.success("Comment deleted successfully");
      // Invalidate query để refetch danh sách bình luận
      queryClient.invalidateQueries(["comments", post_id]);
    },
    onError: (error) => {
      message.error(error.response?.data?.message || "Error deleting comment");
    },
  });

  return { mutate, isPending };
};

export default useDeleteComment;
