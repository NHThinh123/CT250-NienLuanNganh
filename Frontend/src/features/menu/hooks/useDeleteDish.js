import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteMenuApi } from "../services/menuApi";

const useDeleteMenu = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => deleteMenuApi(id),
    onSuccess: () => {
      queryClient.invalidateQueries("menus"); // Làm mới danh sách món ăn
    },
  });
};

export default useDeleteMenu;
