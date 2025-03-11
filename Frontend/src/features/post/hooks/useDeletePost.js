import { useMutation, useQueryClient } from "@tanstack/react-query";
import { notification } from "antd"; // Import notification từ antd
import { deletePostApi } from "../services/postApi";

const useDeletePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ post_id, id }) => deletePostApi(post_id, id),
    onSuccess: () => {
      // Hiển thị thông báo thành công bằng antd notification
      notification.success({
        message: "Thành công",
        description: "Bài viết đã được xóa thành công",
      });

      queryClient.invalidateQueries({ queryKey: ["posts"] });
      //queryClient.invalidateQueries({ queryKey: ["post", data.post_id] });
    },
    onError: () => {
      notification.error({
        message: "Lỗi",
        description: "Đã có lỗi xảy ra, vui lòng thử lại sau",
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });
};

export default useDeletePost;
