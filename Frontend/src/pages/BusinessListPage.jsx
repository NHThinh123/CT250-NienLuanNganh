import useBusiness from "../features/business/hooks/useBusiness";
import { Col, Row } from "antd";
import Businesses from "../features/business/components/templates/Businesses";

const BusinessListPage = () => {
  const { businessData } = useBusiness();
  return (
    <Row>
      <Col xs={0} sm={1} md={2} lg={2} xl={3}></Col>
      <Col xs={24} sm={22} md={20} lg={20} xl={18}>
        <Businesses businessData={businessData} />
      </Col>
      <Col xs={0} sm={1} md={2} lg={2} xl={3}></Col>
    </Row>
  );
};

export default BusinessListPage;
