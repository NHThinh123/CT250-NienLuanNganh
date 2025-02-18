import { useQuery } from "@tanstack/react-query";
import { getDishByIdApi } from "../services/dishApi";

const useDishById = (id) => {
  const {
    data: dishData = {},
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["dishes", id],
    queryFn: () => getDishByIdApi(id),
  });

  return { dishData, isLoading, isError };
};

export default useDishById;
