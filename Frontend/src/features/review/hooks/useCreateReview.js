import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createReviewApi } from "../services/reviewApi";

const useCreateReview = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createReviewApi,
    onSuccess: () => {
      queryClient.invalidateQueries("reviews"); // Làm mới danh sách reviews
    },
    onError: (error) => {
      console.error("Lỗi khi tạo review:", error);
    },
  });
};

export default useCreateReview;
