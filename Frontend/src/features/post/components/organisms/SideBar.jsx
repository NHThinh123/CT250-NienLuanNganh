import { useContext } from "react";
import HotTopicList from "../molecules/HotTopicList";
import SearchingPostContainer from "../molecules/SearchingPostContainer";
import UpLoadPostContainer from "../molecules/UpLoadPostContainer";
import { AuthContext } from "../../../../contexts/auth.context";
const SideBar = () => {
  const { auth } = useContext(AuthContext);
  const user_id = auth?.user?.id;
  return (
    <>
      <UpLoadPostContainer />
      {user_id && <SearchingPostContainer />}

      <HotTopicList />
    </>
  );
};

export default SideBar;
