import { useInfiniteQuery } from "@tanstack/react-query";
import {
  getPostApi,
  getLikedPostsApi,
  getCommentedPostsApi,
} from "../services/postApi";

// Hook cho danh sách bài viết chung
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

// Hook cho danh sách bài viết đã thích
const useLikedPosts = (params) => {
  return useInfiniteQuery({
    queryKey: ["liked-posts", params],
    queryFn: getLikedPostsApi,
    getNextPageParam: (lastPage) => {
      return lastPage.pagination.page < lastPage.pagination.totalPages
        ? lastPage.pagination.page + 1
        : undefined;
    },
  });
};

// Hook cho danh sách bài viết đã bình luận
const useCommentedPosts = (params) => {
  return useInfiniteQuery({
    queryKey: ["commented-posts", params],
    queryFn: getCommentedPostsApi,
    getNextPageParam: (lastPage) => {
      return lastPage.pagination.page < lastPage.pagination.totalPages
        ? lastPage.pagination.page + 1
        : undefined;
    },
  });
};

export { usePost, useLikedPosts, useCommentedPosts };
