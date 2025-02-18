import { useQuery } from "react-query";
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