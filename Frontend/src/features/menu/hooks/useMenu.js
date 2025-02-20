import { useQuery } from "@tanstack/react-query";
import { getMenuApi } from "../services/menuApi";

const useMenu = () => {
    const {
    data: menuData = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["menus"],
    queryFn: getMenuApi,
  });

  return { menuData, isLoading, isError };
};

export default useMenu;