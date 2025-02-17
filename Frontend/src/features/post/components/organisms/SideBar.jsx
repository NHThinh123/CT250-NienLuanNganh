import Footer from "../../../../components/templates/Footer";
import HotTopicList from "../molecules/HotTopicList";
import SearchingPostContainer from "../molecules/SearchingPostContainer";
import UpLoadPostContainer from "../molecules/UpLoadPostContainer";
const SideBar = () => {
  return (
    <>
      <UpLoadPostContainer />
      <SearchingPostContainer />
      <HotTopicList />
      <Footer />
    </>
  );
};

export default SideBar;
