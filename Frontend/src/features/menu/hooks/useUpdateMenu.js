import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateMenuApi } from "../services/menuApi";

const useUpdateMenu = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => updateMenuApi(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries("menus"); // Làm mới danh sách món ăn
    },
  });
};

export default useUpdateMenu;
