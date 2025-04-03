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
  const { business } = useContext(BusinessContext);
  const { businessData, isLoadingBusiness, isErrorBusiness } =
    useBusinessById(id);
  const { menuData, isLoadingMenu, isErrorMenu } = useMenuByBusinessId(id);

  const canEdit = business.isAuthenticated && business.business.id === id;
  const displayData =
    businessData ||
    (business.isAuthenticated && business.business.id === id
      ? business.business
      : null);

  if (!displayData) {
    return <p>Không tìm thấy thông tin doanh nghiệp.</p>;
  }

  return (
    <div style={{ marginTop: 68 }}>
      <div>
        <BusinessDetail
          businessData={displayData}
          isLoading={isLoadingBusiness}
          isError={isErrorBusiness}
          canEdit={canEdit}
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
    </div>
  );
};

export default BusinessDetailPage;
