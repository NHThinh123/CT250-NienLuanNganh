import { useQuery } from "@tanstack/react-query";
import { getReviewByIdApi } from "../services/reviewApi";

const useReviewById = (id) => {
  const {
    data: reviewData = {},
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["reviews", id],
    queryFn: () => getReviewByIdApi(id),
  });

  return { reviewData, isLoading, isError };
};

export default useReviewById;
