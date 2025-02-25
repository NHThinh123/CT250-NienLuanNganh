import { useQuery } from "@tanstack/react-query";
import { getReviewsByBusinessIdApi } from "../services/reviewApi";

const useReviewByBusinessId = (id) => {
  const { data: reviewData = [] } = useQuery({
    queryKey: ["reviews", id],
    queryFn: () => getReviewsByBusinessIdApi(id),
  });
  return { reviewData };
};

export default useReviewByBusinessId;
