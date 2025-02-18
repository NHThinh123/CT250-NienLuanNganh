import { useQuery } from "react-query";
import { getDishApi } from "../services/dishApi";

const useDish = () => {
    const {
    data: dishData = [],
    isLoading: loading,
    isError,
  } = useQuery({
    queryKey: ["dishes"],
    queryFn: getDishApi,
  });

  return { dishData, loading, isError };
};

export default useDish;