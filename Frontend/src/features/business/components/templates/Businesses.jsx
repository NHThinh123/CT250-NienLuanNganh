import { Col, Row, Card } from "antd";
import { Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Business = ({ businessData }) => {
  const navigate = useNavigate();
  return (
    <>
      <Row gutter={[16, 16]}>
        {businessData.map((business) => (
          <Col
            key={business._id}
            xs={24}
            sm={12}
            md={8}
            lg={6}
            xl={6}
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
                description={
                  <div>
                    <p>{business.location}</p>
                    <p>
                      <Clock
                        size={17}
                        style={{ marginRight: "8px", marginBottom: "-3px" }}
                      />
                      {business.open_hours} - {business.close_hours}
                    </p>
                  </div>
                }
              />
            </Card>
          </Col>
        ))}
      </Row>
    </>
  );
};

export default Business;
