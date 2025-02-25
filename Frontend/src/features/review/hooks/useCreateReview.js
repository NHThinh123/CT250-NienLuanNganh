import { useMutation, useQueryClient } from "react-query";
import { createReviewApi } from "../services/reviewApi";

const useCreateReview = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createReviewApi,
    onSuccess: () => {
      queryClient.invalidateQueries("reviews"); // Làm mới danh sách reviews
    },
  });
};

export default useCreateReview;
