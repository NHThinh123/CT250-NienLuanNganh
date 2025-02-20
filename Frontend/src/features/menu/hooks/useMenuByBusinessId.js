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
  console.log(menuData);
  return { menuData, isLoadingMenu, isErrorMenu };
};

export default useMenuByBusinessId;