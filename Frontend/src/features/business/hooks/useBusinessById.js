import { useQuery } from "@tanstack/react-query";
import { getBusinessByIdApi } from "../services/businessApi";

const useBusinessById = (id) => {
  const {
    data: businessData = {},
    isLoadingBusiness: isLoading,
    isErrorBussiness: isError,
  } = useQuery({
    queryKey: ["businesses", id],
    queryFn: () => getBusinessByIdApi(id),
  });

  return { businessData, isLoading, isError };
};

export default useBusinessById;
