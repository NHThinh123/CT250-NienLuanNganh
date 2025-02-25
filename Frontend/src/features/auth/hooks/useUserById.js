import { useQuery } from "@tanstack/react-query";
import { getUserProfile } from "../services/userApi";

const useUserById = (id) => {
  const { data: userData = {} } = useQuery({
    queryKey: ["user", id],
    queryFn: () => getUserProfile(id),
  });

  return { userData };
};

export default useUserById;
