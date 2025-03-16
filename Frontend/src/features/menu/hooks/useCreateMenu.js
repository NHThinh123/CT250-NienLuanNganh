import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createMenuApi } from "../services/menuApi";

const useCreateMenu = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createMenuApi,
    onSuccess: () => {
      // Làm mới query với key "menus"
      queryClient.invalidateQueries({ queryKey: ["menus"] });
    },
    onError: (error) => {
      console.error("Lỗi khi tạo menu:", error);
    },
  });
};

export default useCreateMenu;
