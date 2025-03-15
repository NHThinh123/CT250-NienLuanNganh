import { Col, Row, Card } from "antd";
import { Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import BoxContainer from "../../../../components/atoms/BoxContainer";

const removeAccents = (str) => {
  // Ensure str is a string before calling normalize
  return str
    .toString() // Convert to string if it’s not already
    .normalize("NFD") // Normalize to decompose accents
    .replace(/[\u0300-\u036f]/g, "") // Remove diacritical marks
    .replace(/đ/g, "d") // Replace Vietnamese 'đ' with 'd'
    .replace(/Đ/g, "D"); // Replace Vietnamese 'Đ' with 'D'
};

const Businesses = ({ businessData, searchKeyword }) => {
  console.log("businessData in businesses", businessData);
  const navigate = useNavigate();
  const filteredBusinessData = businessData.filter((business) => {
    const businessName = removeAccents(
      business.business_name || ""
    ).toLowerCase();
    const keyword = removeAccents(searchKeyword || "").toLowerCase();
    return businessName.includes(keyword);
  });
  if (filteredBusinessData.length === 0) {
    return null;
  }
  return (
    <BoxContainer>
      <Row
        gutter={[24, 24]}
        justify={
          filteredBusinessData.length / 4 == 0 ? "space-between" : "start"
        }
      >
        {filteredBusinessData.map((business) => (
          <Col
            key={business._id}
            xs={24} // 1 card trên dòng khi màn hình nhỏ
            sm={12} // 2 card trên dòng khi màn hình nhỏ hơn
            md={8} // 3 card trên dòng khi màn hình trung bình
            lg={6} // 4 card trên dòng khi màn hình lớn
            xl={6} // Giữ nguyên 4 card trên dòng ở màn hình rất lớn
            style={{ display: "flex", justifyContent: "center" }}
          >
            <Card
              hoverable
              cover={
                <img
                  style={{
                    width: "100%",
                    height: "180px",
                    objectFit: "cover", // Giữ tỷ lệ ảnh mà không bị méo
                    borderTopLeftRadius: "8px",
                    borderTopRightRadius: "8px",
                  }}
                  alt="business avatar"
                  src={business.avatar || "N/A"}
                />
              }
              onClick={() => navigate(`/businesses/${business._id}`)}
              style={{
                width: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                minHeight: "250px",
              }}
            >
              <div>
                <Card.Meta
                  title={
                    <span
                      style={{
                        maxWidth: "100%",
                        display: "block",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {business.business_name || "N/A"}
                    </span>
                  }
                />
                <div
                  style={{
                    fontSize: "14px",
                    color: "#666",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    marginTop: 8,
                  }}
                >
                  {business.location || "N/A"}
                </div>
              </div>
              <p
                style={{
                  marginTop: "8px",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <Clock size={17} style={{ marginRight: "8px" }} />
                {business.open_hours || "N/A"} - {business.close_hours || "N/A"}
              </p>
            </Card>
          </Col>
        ))}
      </Row>
    </BoxContainer>
  );
};

export default Businesses;
