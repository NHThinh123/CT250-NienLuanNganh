import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateDishApi } from "../services/dishApi";

const useUpdateDish = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => updateDishApi(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries("dishes"); // Làm mới danh sách món ăn
    },
  });
};

export default useUpdateDish;
