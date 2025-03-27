import { useMutation, useQueryClient } from "@tanstack/react-query";

import { message } from "antd";
import { updateCommentApi } from "../services/commentApi";

const useUpdateComment = (post_id) => {
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: ({ comment_id, comment_content }) =>
      updateCommentApi(comment_id, { comment_content }),
    onSuccess: () => {
      message.success("Comment updated successfully");
      // Invalidate query để refetch danh sách bình luận
      queryClient.invalidateQueries(["comments", post_id]);
    },
    onError: (error) => {
      message.error(error.response?.data?.message || "Error updating comment");
    },
  });

  return { mutate, isPending };
};

export default useUpdateComment;
