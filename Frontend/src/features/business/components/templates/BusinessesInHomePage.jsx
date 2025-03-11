import { Col, Row, Card } from "antd";
import { Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";

const BusinessInHomePage = ({ businessData }) => {
  const navigate = useNavigate();
  const maxTitleLength = 20; // Giới hạn ký tự tiêu đề trước khi cắt
  const maxDescriptionLength = 30; // Giới hạn ký tự mô tả trước khi cắt
  if (!businessData) return <>loading</>;
  return (
    <>
      <Row gutter={[16, 16]}>
        {businessData.slice(0, 8).map((business) => (
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
              <div style={{ display: "inline-block" }}>
                <Card.Meta
                  title={
                    business?.business_name?.length > maxTitleLength
                      ? business?.business_name?.slice(0, maxTitleLength) +
                        "..."
                      : business?.business_name
                  }
                  style={{ marginBottom: 8 }}
                />
              </div>
              <div>
                <div style={{ display: "inline-block" }}>
                  <p
                    style={{
                      marginBottom: 8,
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {business?.location?.length > maxDescriptionLength
                      ? business?.location.slice(0, maxDescriptionLength) +
                        "..."
                      : business?.location}
                  </p>
                </div>
              </div>
              <p>
                <Clock
                  size={17}
                  style={{ marginRight: "8px", marginBottom: "-3px" }}
                />
                {business?.open_hours} - {business?.close_hours}
              </p>
            </Card>
          </Col>
        ))}
      </Row>
    </>
  );
};

export default BusinessInHomePage;
