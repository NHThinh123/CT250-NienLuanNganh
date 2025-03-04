import { useInfiniteQuery } from "@tanstack/react-query";
import { getPostApi } from "../services/postApi";

const usePost = (params) => {
  return useInfiniteQuery({
    queryKey: ["posts", params],
    queryFn: getPostApi,
    getNextPageParam: (lastPage, allPages) => {
      const currentPostIds = allPages.flatMap((page) =>
        page.posts.map((p) => p._id)
      );
      const newPostIds = lastPage.posts.map((p) => p._id);
      if (newPostIds.some((id) => currentPostIds.includes(id))) {
        console.warn("Duplicate posts detected");
      }
      return lastPage.pagination.page < lastPage.pagination.totalPages
        ? lastPage.pagination.page + 1
        : undefined;
    },
  });
};

export default usePost;
