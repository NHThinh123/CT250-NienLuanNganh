import { useQuery } from "@tanstack/react-query";
import { getBusinessApi } from "../services/businessApi";

const useBusiness = () => {
  const { data: businessData = [], isLoading } = useQuery({
    queryKey: ["businesses"],
    queryFn: getBusinessApi,
  });
  return { businessData, isLoading };
};

export default useBusiness;
