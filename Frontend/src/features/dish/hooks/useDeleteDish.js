import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteDishApi } from "../services/dishApi";

const useDeleteDish = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => deleteDishApi(id),
    onSuccess: () => {
      queryClient.invalidateQueries("dishes"); // Làm mới danh sách món ăn
    },
  });
};

export default useDeleteDish;
