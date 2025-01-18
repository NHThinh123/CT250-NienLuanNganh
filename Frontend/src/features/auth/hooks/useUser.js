import { useEffect, useState } from "react";
import { getUserApi } from "../services/userApi";

const useUser = () => {
  const [userData, setUserData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await getUserApi();

        if (res && res.status === "success") {
          setUserData(res.data);
          console.log(userData);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchUserData();
  }, []);

  return { userData, loading, setLoading };
};

export default useUser;
