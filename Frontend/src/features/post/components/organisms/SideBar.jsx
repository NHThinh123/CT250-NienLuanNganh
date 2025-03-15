import SearchingPostContainer from "../molecules/SearchingPostContainer";
import UpLoadPostContainer from "../molecules/UpLoadPostContainer";

const SideBar = ({ listType, onChange }) => {
  return (
    <>
      <UpLoadPostContainer />
      <SearchingPostContainer listType={listType} onChange={onChange} />
    </>
  );
};

export default SideBar;
