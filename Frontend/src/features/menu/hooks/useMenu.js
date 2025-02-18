import { useQuery } from "react-query";
import { getMenuApi } from "../services/menuApi";

const useMenu = () => {
    const {
    data: menuData = [],
    isLoading: loading,
    isError,
  } = useQuery({
    queryKey: ["menus"],
    queryFn: getMenuApi,
  });

  return { menuData, loading, isError };
};

export default useMenu;