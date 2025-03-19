import PostOverview from "../molecules/PostOverview";
import SearchingPostContainer from "../molecules/SearchingPostContainer";
import UpLoadPostContainer from "../molecules/UpLoadPostContainer";

const SideBar = ({ listType, onChange }) => {
  return (
    <>
      <UpLoadPostContainer />
      <SearchingPostContainer listType={listType} onChange={onChange} />
      <PostOverview />
    </>
  );
};

export default SideBar;
