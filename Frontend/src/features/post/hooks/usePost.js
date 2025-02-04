import { useQuery } from "@tanstack/react-query";
import { getPostApi } from "../services/postApi";

const usePost = () => {
  const {
    data: postData = [],
    isLoading: loading,
    isError,
  } = useQuery({
    queryKey: ["post"],
    queryFn: getPostApi,
  });

  return { postData, loading, isError };
};

export default usePost;
