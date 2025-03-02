import { useQuery } from "@tanstack/react-query";
import { getPostApi } from "../services/postApi";

const usePost = (params) => {
  return useQuery({
    queryKey: ["posts", params],
    queryFn: () => getPostApi(params),
    keepPreviousData: true, // Giữ dữ liệu cũ trong khi tải dữ liệu mới
  });
};

export default usePost;
