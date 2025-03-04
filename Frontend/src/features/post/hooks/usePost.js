import { useInfiniteQuery } from "@tanstack/react-query";
import { getPostApi } from "../services/postApi";

const usePost = (params) => {
  return useInfiniteQuery({
    queryKey: ["posts", params],
    queryFn: getPostApi,
    getNextPageParam: (lastPage) => {
      return lastPage.pagination.page < lastPage.pagination.totalPages
        ? lastPage.pagination.page + 1
        : undefined;
    },
  });
};

export default usePost;
