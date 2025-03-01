import { useQuery } from "@tanstack/react-query";
import { getPostByIdApi } from "../services/postApi";
import { useContext } from "react";
import { AuthContext } from "../../../contexts/auth.context";

const usePostById = (postId) => {
  const { auth } = useContext(AuthContext);
  const {
    data: postData = {},
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["posts", postId, auth?.user?.id],
    queryFn: () => getPostByIdApi(postId, auth?.user?.id),
  });

  return { postData, isLoading, isError };
};

export default usePostById;
