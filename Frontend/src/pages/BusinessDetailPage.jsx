import { useParams } from "react-router-dom";
import useBusinessById from "../features/business/hooks/useBusinessById";
import BusinessDetail from "../features/business/components/templates/BusinessDetail";

// import useMenuById from "../features/menu/hooks/useMenuById";
import MenuDetail from "../features/menu/components/templates/MenuDetail";

const BusinessDetailPage = () => {
  const { id } = useParams();
  const { businessData, isLoading, isError } = useBusinessById(id);
  // const { menuData, isLoading, isError } = useMenuById(id);
  console.log(businessData, isLoading, isError);
  return (
    <>
      {/* <ButtonCustomize margin={"8px 0px"} to={"/posts/create"}>
        Thêm bài đăng
      </ButtonCustomize> */}
      <div>
        <BusinessDetail businessData={businessData} isLoading={isLoading} isError={isError}/>
      </div>
      <div>
        <MenuDetail/>
      </div>
      
      
    </>
  );
};

export default BusinessDetailPage;
