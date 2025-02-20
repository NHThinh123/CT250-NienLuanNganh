import { useParams } from "react-router-dom";
import useBusinessById from "../features/business/hooks/useBusinessById";
import BusinessDetail from "../features/business/components/templates/BusinessDetail";
import MenuDetail from "../features/menu/components/templates/MenuDetail";
import useMenuByBusinessId from "../features/menu/hooks/useMenuByBusinessId";

const BusinessDetailPage = () => {
  const { id } = useParams();
  const { businessData, isLoadingBusiness, isErrorBusiness } =
    useBusinessById(id);
  const { menuData, isLoadingMenu, isErrorMenu } = useMenuByBusinessId(id);
  console.log(businessData, isLoadingBusiness, isErrorBusiness);
  console.log(menuData, isLoadingMenu, isErrorMenu);
  return (
    <>
      <div>
        <BusinessDetail
          businessData={businessData}
          isLoadingBusiness={isLoadingBusiness}
          isErrorBusiness={isErrorBusiness}
        />
      </div>
      <div>
        <MenuDetail
          menuData={menuData}
          isLoadingMenu={isLoadingMenu}
          isErrorMenu={isErrorMenu}
        />
      </div>
    </>
  );
};

export default BusinessDetailPage;
