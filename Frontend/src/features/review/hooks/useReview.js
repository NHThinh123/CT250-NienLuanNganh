import { useQuery } from "@tanstack/react-query";
import { getReviewApi } from "../services/reviewApi";

const useReview = () => {
  const { data: reviewData = [] } = useQuery({
    queryKey: ["reviews"],
    queryFn: getReviewApi,
  });

  return { reviewData };
};

export default useReview;
