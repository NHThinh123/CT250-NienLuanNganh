import { Outlet } from "react-router-dom";

import NavBar from "./components/templates/NavBar";

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
    <>
      <h1>YUMZY</h1>
      <NavBar />
      <Outlet />
    </>
  );
}

export default App;
