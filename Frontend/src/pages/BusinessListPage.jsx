import useBusiness from "../features/business/hooks/useBusiness";
import Business from "../features/business/components/templates/Businesses";
import { Col, Row } from "antd";

const BusinessListPage = () => {
  const { businessData } = useBusiness();
  console.log(businessData);
  return (
    <>
      <div>
        <Row>
          <div style={{ textAlign: "center", width: "100%", margin: "20px 0" }}>
            <h1>Danh sách quán ăn</h1>
          </div>
        </Row>
        <Row>
          <Col span={3}></Col>
          <Col span={18}>
            <hr style={{ border: "no", opacity: "1", marginBottom: "10px" }} />
            <Business businessData={businessData} />
          </Col>

          <Col span={3}></Col>
        </Row>
      </div>
    </>
  );
};

export default BusinessListPage;
