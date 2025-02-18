import { useMutation, useQueryClient } from "react-query";
import { createBusinessApi } from "../services/businessApi";

const useCreateBusiness = () => {
    const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createBusinessApi,
    onSuccess: () => {
      queryClient.invalidateQueries("businesses"); // Làm mới danh sách doanh nghiệp
    },
  });
};

export default useCreateBusiness;