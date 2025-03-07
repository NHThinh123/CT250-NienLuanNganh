import { useInfiniteQuery } from "@tanstack/react-query";
import { getMyPostsApi } from "../services/postApi";

const useMyPost = (params) => {
  return useInfiniteQuery({
    queryKey: ["posts", params],
    queryFn: getMyPostsApi,
    getNextPageParam: (lastPage) => {
      return lastPage.pagination.page < lastPage.pagination.totalPages
        ? lastPage.pagination.page + 1
        : undefined;
    },
  });
};

export default useMyPost;
