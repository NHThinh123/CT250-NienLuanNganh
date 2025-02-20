import { useQuery } from "@tanstack/react-query";
import { getDishesByMenuIdApi } from "../services/dishApi";

const useDishByMenuId = (id) => {
  const {
    data: dishData = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["dishes", id],
    queryFn: () => getDishesByMenuIdApi(id),
  });

  return { dishData, isLoading, isError };
};

export default useDishByMenuId;
