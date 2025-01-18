import { Outlet } from "react-router-dom";

import axios from "./services/axios.customize";
import { useEffect } from "react";
import NavBar from "./components/templates/NavBar";

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
  return (
    <>
      <h1>Food Review App</h1>
      <NavBar />
      <Outlet />
    </>
  );
}

export default App;
