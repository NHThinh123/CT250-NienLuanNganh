import { useQuery } from "@tanstack/react-query";
import { getAssetReviewByBusinessId } from "../services/reviewApi";

const useAssetReviewByBusinessId = (id) => {
  const { data: assetReviewData = [] } = useQuery({
    queryKey: ["asset_reviews", id],
    queryFn: () => getAssetReviewByBusinessId(id),
  });
  return { assetReviewData };
};

export default useAssetReviewByBusinessId;
