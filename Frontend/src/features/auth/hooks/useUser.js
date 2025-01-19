import { useEffect, useState } from "react";
import { getUserApi } from "../services/userApi";
import { useQuery } from "@tanstack/react-query";

const useUser = () => {
  // const [userData, setUserData] = useState([]);
  // const [loading, setLoading] = useState(true);

  // useEffect(() => {
  //   const fetchUserData = async () => {
  //     try {
  //       const res = await getUserApi();

  //       if (res) {
  //         setUserData(res);
  //         console.log(userData);
  //       }
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   };
  //   fetchUserData();
  // }, []);

  const {
    data: userData = [],
    isLoading: loading,
    isError,
  } = useQuery({
    queryKey: ["user"],
    queryFn: getUserApi,
  });

  return { userData, loading, isError };
};

export default useUser;
