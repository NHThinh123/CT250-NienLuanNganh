import { useQuery } from "@tanstack/react-query";
import { getAssetReviewByReviewId } from "../services/reviewApi";

const useAssetReviewByReviewId = (id) => {
  const { data: assetReviewData = [] } = useQuery({
    queryKey: ["asset_reviews", id],
    queryFn: () => getAssetReviewByReviewId(id),
  });
  return { assetReviewData };
};

export default useAssetReviewByReviewId;
