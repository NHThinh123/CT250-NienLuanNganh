import { useMutation, useQueryClient } from "react-query";
import { createMenuApi } from "../services/menuApi";

const useCreateMenu = () => {
    const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createMenuApi,
    onSuccess: () => {
      queryClient.invalidateQueries("menus"); // Làm mới danh sách món ăn
    },
  });
};

export default useCreateMenu;