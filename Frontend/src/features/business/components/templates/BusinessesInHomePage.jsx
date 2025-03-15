import { Col, Row, Card } from "antd";
import { Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";

const BusinessInHomePage = ({ businessData }) => {
  console.log("business data", businessData);
  const navigate = useNavigate();
  const maxTitleLength = 20;
  const maxDescriptionLength = 30;

  if (!businessData || !Array.isArray(businessData)) {
    return <p>Loading or no data available</p>;
  }

  return (
    <Row gutter={[16, 16]}>
      {businessData.slice(0, 10).map((business) => (
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
                style={{ width: "100%", height: "200px" }}
                alt="business avatar"
                src={business.avatar || "default-image.jpg"}
              />
            }
            onClick={() => navigate(`/businesses/${business._id}`)}
          >
            <Card.Meta
              title={
                (business.business_name?.length || 0) > maxTitleLength
                  ? business.business_name.slice(0, maxTitleLength) + "..."
                  : business.business_name || "No Name"
              }
              style={{ marginBottom: 8 }}
            />
            <p
              style={{
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {(business.location?.length || 0) > maxDescriptionLength
                ? business.location.slice(0, maxDescriptionLength) + "..."
                : business.location || "No Address"}
            </p>
            <p>
              <Clock
                size={17}
                style={{ marginRight: "8px", marginBottom: "-3px" }}
              />
              {business.open_hours || "00:00"} -{" "}
              {business.close_hours || "00:00"}
            </p>
          </Card>
        </Col>
      ))}
    </Row>
  );
};

export default BusinessInHomePage;
