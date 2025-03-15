import useBusiness from "../features/business/hooks/useBusiness";
import { Col, Row } from "antd";
import BusinessList from "../features/business/components/templates/BusinessList";

const BusinessListPage = () => {
  const { businessData } = useBusiness();
  return (
    <Row>
      <Col span={3}></Col>
      <Col span={18}>
        <BusinessList businessData={businessData} />
      </Col>
      <Col span={3}></Col>
    </Row>
  );
};

export default BusinessListPage;
