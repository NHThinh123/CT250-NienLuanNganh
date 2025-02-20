import { Col, Row, Card } from "antd";
import { useNavigate } from "react-router-dom";

const Business = ({ businessData }) => {
  const navigate = useNavigate();
  return (
    <>
      <Row>
        <div style={{ textAlign: "center", width: "100%", margin: "20px 0" }}>
          <h1>Danh sách quán ăn</h1>
        </div>
      </Row>
      <Row>
        <Col span={3}></Col>
        <Col span={18}>
          <hr style={{ border: "no", opacity: "1", marginBottom: "10px" }} />
        </Col>
        <Col span={3}></Col>
      </Row>
      <Row gutter={[16, 16]}>
        <Col span={3}></Col>
        {businessData.map((business) => (
          <Col
            key={business._id}
            xs={24}
            sm={12}
            md={8}
            lg={6}
            xl={4}
            style={{ padding: "10px" }}
          >
            <Card
              hoverable
              cover={
                <img
                  style={{ width: "100%", height: "150px" }}
                  alt="business avatar"
                  src={business.avatar}
                />
              }
              onClick={() => navigate(`/businesses/${business._id}`)}
            >
              <Card.Meta
                title={business.business_name}
                description={business.location}
              />
            </Card>
          </Col>
        ))}
      </Row>
    </>
  );
};

export default Business;
