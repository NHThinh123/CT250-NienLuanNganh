import axios from "./services/axios.customize";
import { useEffect } from "react";

function App() {
  useEffect(() => {
    const fetchData = async () => {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/user/`
      );
      console.log(res);
    };

    fetchData();
  }, []);
  return <>hello world</>;
}

export default App;
