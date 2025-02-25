import { useQuery } from "@tanstack/react-query";
import { getMenusByBusinessIdApi } from "../services/menuApi";

const useMenuByBusinessId = (id) => {
  const {
    data: menuData = [],
    isLoading: isLoadingMenu,
    isError: isErrorMenu,
  } = useQuery({
    queryKey: ["menus", id],
    queryFn: () => getMenusByBusinessIdApi(id),
  });
  return { menuData, isLoadingMenu, isErrorMenu };
};

export default useMenuByBusinessId;
