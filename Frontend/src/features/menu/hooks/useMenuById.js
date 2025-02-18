import { useQuery } from "@tanstack/react-query";
import { getMenuByIdApi } from "../services/menuApi";

const useMenuById = (id) => {
  const {
    data: menuData = {},
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["menus", id],
    queryFn: () => getMenuByIdApi(id),
  });

  return { menuData, isLoading, isError };
};

export default useMenuById;
