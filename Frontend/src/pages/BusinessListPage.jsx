import useBusiness from "../features/business/hooks/useBusiness";
import { Col, Row } from "antd";
import Businesses from "../features/business/components/templates/Businesses";

const BusinessListPage = () => {
  const { businessData } = useBusiness();
  return (
    <Row>
      <Col span={3}></Col>
      <Col span={18}>
        <Businesses businessData={businessData} />
      </Col>
      <Col span={3}></Col>
    </Row>
  );
};

export default BusinessListPage;
