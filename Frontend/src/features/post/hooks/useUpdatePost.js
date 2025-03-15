import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updatePostApi } from "../services/postApi";

const useUpdatePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (formData) => updatePostApi(formData), // Nhận FormData trực tiếp
    onSuccess: () => {
      queryClient.invalidateQueries("posts"); // Làm mới danh sách bài viết của người dùng
    },
    onError: (error) => {
      console.error("Lỗi khi cập nhật bài viết:", error); // Log lỗi để debug
    },
  });
};

export default useUpdatePost;
