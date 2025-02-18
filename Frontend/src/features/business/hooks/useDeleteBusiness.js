import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteBusinessApi } from "../services/businessApi";

const useDeleteBusiness = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => deleteBusinessApi(id),
    onSuccess: () => {
      queryClient.invalidateQueries("businesses"); // Làm mới danh sách doanh nghiệp
    },
  });
};

export default useDeleteBusiness;
