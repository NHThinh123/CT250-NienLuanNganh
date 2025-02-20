import useBusiness from "../features/business/hooks/useBusiness";
import Business from "../features/business/components/templates/Businesses";

const BusinessListPage = () => {
  const { businessData } = useBusiness();
  console.log(businessData);
  return (
    <>
      <div>
        <Business businessData={businessData} />
      </div>
    </>
  );
};

export default BusinessListPage;
