import { useQuery } from "@tanstack/react-query";
import { getBusinessApi } from "../services/businessApi";

const useBusiness = () => {
  const { data: businessData = [] } = useQuery({
    queryKey: ["businesses"],
    queryFn: getBusinessApi,
  });
  return { businessData };
};

export default useBusiness;
