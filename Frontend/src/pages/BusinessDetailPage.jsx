import { useParams } from "react-router-dom";
import useBusinessById from "../features/business/hooks/useBusinessById";
import BusinessDetail from "../features/business/components/templates/BusinessDetail";
import MenuDetail from "../features/menu/components/templates/MenuDetail";
// import MenuDetail from "../features/menu/components/templates/MenuDetailTest";
import useMenuByBusinessId from "../features/menu/hooks/useMenuByBusinessId";
import { useContext } from "react";
import { BusinessContext } from "../../src/contexts/business.context";

const BusinessDetailPage = () => {
  const { id } = useParams();
  const { businessData, isLoadingBusiness, isErrorBusiness } =
    useBusinessById(id);
  const { menuData, isLoadingMenu, isErrorMenu } = useMenuByBusinessId(id);
  const { business } = useContext(BusinessContext);

  const canEdit = business.isAuthenticated && business.business.id === id;

  return (
    <>
      <div>
        <BusinessDetail
          businessData={businessData}
          isLoading={isLoadingBusiness} // Điều chỉnh tên prop cho đồng bộ với BusinessDetail
          isError={isErrorBusiness} // Điều chỉnh tên prop cho đồng bộ với BusinessDetail
          canEdit={canEdit} // Truyền prop canEdit
        />
      </div>
      <div>
        <MenuDetail
          menuData={menuData}
          isLoadingMenu={isLoadingMenu}
          isErrorMenu={isErrorMenu}
          business_id={id}
        />
      </div>
    </>
  );
};

export default BusinessDetailPage;
