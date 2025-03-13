// import HotTopicList from "../molecules/HotTopicList";
import SearchingPostContainer from "../molecules/SearchingPostContainer";
import UpLoadPostContainer from "../molecules/UpLoadPostContainer";

const SideBar = ({ isCreate }) => {
  return (
    <>
      <UpLoadPostContainer isCreate={isCreate} />
      <SearchingPostContainer />

      {/* <HotTopicList /> */}
    </>
  );
};

export default SideBar;
