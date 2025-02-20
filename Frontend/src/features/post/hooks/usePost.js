import { useQuery } from "@tanstack/react-query";
import { getPostApi } from "../services/postApi";
import { useContext } from "react";
import { AuthContext } from "../../../contexts/auth.context";

const usePost = () => {
  const { auth } = useContext(AuthContext);
  const {
    data: postData = [],
    isLoading: loading,
    isError,
  } = useQuery({
    queryKey: ["posts"],
    queryFn: () => getPostApi(auth?.user?.id),
  });

  return { postData, loading, isError };
};

export default usePost;
