import { useQuery } from "@tanstack/react-query";
import { getBusinessApi } from "../services/businessApi";

const useBusiness = () => {
  const {
    data: businessData = [],
    isLoading: loading,
    isError,
  } = useQuery({
    queryKey: ["businesses"],
    queryFn: getBusinessApi,
  });

  return { businessData, loading, isError };
};

export default useBusiness;
