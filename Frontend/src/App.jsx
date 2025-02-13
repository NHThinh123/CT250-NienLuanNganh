import { Outlet } from "react-router-dom";

import NavBar from "./components/templates/NavBar";
import { Layout } from "antd";

function App() {
  // useEffect(() => {
  //   const fetchData = async () => {
  //     const res = await axios.get(
  //       `${import.meta.env.VITE_BACKEND_URL}/api/users/`
  //     );
  //     console.log(res);
  //   };

  //   fetchData();
  // }, []);
  return (
    <Layout>
      <h1 style={{ backgroundColor: "#fff" }}>YUMZY</h1>
      <NavBar />
      <Outlet />
    </Layout>
  );
}

export default App;
