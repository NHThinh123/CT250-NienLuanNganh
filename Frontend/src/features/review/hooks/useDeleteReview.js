import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteReviewApi } from "../services/reviewApi";

const useDeleteReview = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => deleteReviewApi(id),
    onSuccess: () => {
      queryClient.invalidateQueries("reviews"); // Làm mới danh sách reviews
    },
  });
};

export default useDeleteReview;
