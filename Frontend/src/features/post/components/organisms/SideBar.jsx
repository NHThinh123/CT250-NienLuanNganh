import HotTopicList from "../molecules/HotTopicList";
import SearchingPostContainer from "../molecules/SearchingPostContainer";
import UpLoadPostContainer from "../molecules/UpLoadPostContainer";
const SideBar = () => {
  return (
    <>
      <UpLoadPostContainer />
      <SearchingPostContainer />
      <HotTopicList />
    </>
  );
};

export default SideBar;
