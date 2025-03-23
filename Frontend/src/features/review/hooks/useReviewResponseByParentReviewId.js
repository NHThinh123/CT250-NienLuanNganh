import { useQuery } from "@tanstack/react-query";
import { getReviewResponseByParentReviewId } from "../services/reviewApi";

const useReviewResponseByParentReviewId = (id) => {
  const { data: reviewResponseData = [] } = useQuery({
    queryKey: ["reviews", id],
    queryFn: () => getReviewResponseByParentReviewId(id),
  });
  return { reviewResponseData };
};

export default useReviewResponseByParentReviewId;
