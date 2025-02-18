import { useMutation, useQueryClient } from "react-query";
import { createDishApi } from "../services/dishApi";

const useCreateDish = () => {
    const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createDishApi,
    onSuccess: () => {
      queryClient.invalidateQueries("dishes"); // Làm mới danh sách món ăn
    },
  });
};

export default useCreateDish;