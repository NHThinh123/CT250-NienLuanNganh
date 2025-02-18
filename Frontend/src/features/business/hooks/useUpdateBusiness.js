import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateBusinessApi } from "../services/businessApi";

const useUpdateBusiness = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => updateBusinessApi(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries("businesses"); // Làm mới danh sách doanh nghiệp
    },
  });
};

export default useUpdateBusiness;
