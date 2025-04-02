import { Col, Row, Card } from "antd";
import { CircleDollarSign, Clock } from "lucide-react";
import Rating from "react-rating";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar as solidStar } from "@fortawesome/free-solid-svg-icons";
import { faStar as regularStar } from "@fortawesome/free-regular-svg-icons";
import { useNavigate } from "react-router-dom";

const isBusinessOpen = (openHours, closeHours) => {
  if (!openHours || !closeHours) return false; // Nếu không có giờ, mặc định là đóng

  const now = new Date();
  const currentHours = now.getHours();
  const currentMinutes = now.getMinutes();
  const currentTimeInMinutes = currentHours * 60 + currentMinutes;

  // Chuyển đổi openHours và closeHours sang phút
  const [openHour, openMinute] = openHours.split(":").map(Number);
  const [closeHour, closeMinute] = closeHours.split(":").map(Number);
  const openTimeInMinutes = openHour * 60 + openMinute;
  const closeTimeInMinutes = closeHour * 60 + closeMinute;

  // Xử lý trường hợp giờ đóng cửa vượt qua nửa đêm (ví dụ: 06:00 - 02:00)
  if (closeTimeInMinutes < openTimeInMinutes) {
    return (
      currentTimeInMinutes >= openTimeInMinutes ||
      currentTimeInMinutes < closeTimeInMinutes
    );
  }

  // Trường hợp bình thường (ví dụ: 08:00 - 22:00)
  return (
    currentTimeInMinutes >= openTimeInMinutes &&
    currentTimeInMinutes < closeTimeInMinutes
  );
};

const BusinessInHomePage = ({ businessData }) => {
  const navigate = useNavigate();

  const formatPrice = (price) => {
    if (typeof price !== "number" || isNaN(price)) {
      return "N/A";
    }
    return price.toLocaleString("vi-VN");
  };

  if (!businessData || !Array.isArray(businessData)) {
    return <p>Loading or no data available</p>;
  }

  return (
    <Row gutter={[16, 16]}>
      {businessData.slice(0, 10).map((business) => (
        <Col
          key={business._id}
          xs={12}
          sm={8}
          md={8}
          lg={6}
          xl={6}
          style={{ display: "flex" }}
        >
          <div
            style={{
              width: "100%",
              borderRadius: "8px",
              boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
              transition: "box-shadow 0.3s ease-in-out",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.boxShadow =
                "0 6px 16px rgba(0, 0, 0, 0.2)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.boxShadow =
                "0 4px 10px rgba(0, 0, 0, 0.1)")
            }
          >
            <Card
              hoverable
              cover={
                <div style={{ position: "relative", paddingTop: "60%" }}>
                  <img
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      borderTopLeftRadius: "8px",
                      borderTopRightRadius: "8px",
                    }}
                    alt="business avatar"
                    src={business.avatar || "default-image.jpg"}
                  />
                </div>
              }
              onClick={() => navigate(`/businesses/${business._id}`)}
              style={{
                width: "100%",
                display: "flex",
                flexDirection: "column",
                height: "100%",
              }}
              styles={{ body: { padding: "15px", borderRadius: 0 } }}
            >
              <div
                style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <Card.Meta
                  title={
                    <div
                      className="business-title"
                      style={{ marginBottom: "8px" }}
                    >
                      <span
                        style={{
                          display: "block",
                          fontSize: "18px",
                          fontWeight: "bold",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {business.business_name || "N/A"}
                      </span>
                    </div>
                  }
                />
                <div
                  style={{
                    fontSize: "14px",
                    color: "#666",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    marginBottom: 12,
                  }}
                >
                  {business.location || "N/A"}
                </div>
              </div>
              <div className="business-info" style={{ marginTop: "auto" }}>
                <div
                  className="business-price"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "8px",
                    fontSize: "14px",
                  }}
                >
                  <CircleDollarSign
                    size={16}
                    style={{ marginRight: "8px", flexShrink: 0 }}
                  />
                  <div
                    style={{
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {formatPrice(business.dish_lowest_cost)}đ -{" "}
                    {formatPrice(business.dish_highest_cost)}đ
                  </div>
                </div>

                <div
                  className="business-rating"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "8px",
                    fontSize: "14px",
                  }}
                >
                  <span style={{ marginRight: "5px" }}>
                    {business.rating_average || "0"}
                  </span>
                  <Rating
                    initialRating={business.rating_average}
                    readonly
                    emptySymbol={
                      <FontAwesomeIcon
                        icon={regularStar}
                        style={{ fontSize: 14, color: "#ccc" }}
                      />
                    }
                    fullSymbol={
                      <FontAwesomeIcon
                        icon={solidStar}
                        style={{ fontSize: 14, color: "#FFD700" }}
                      />
                    }
                    fractions={10}
                    quiet={true}
                  />
                  <span style={{ marginLeft: "5px" }}>
                    ({business.totalReviews || "0"})
                  </span>
                </div>

                <div
                  className="business-hours"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    fontSize: "14px",
                  }}
                >
                  <Clock
                    size={16}
                    style={{ marginRight: "8px", flexShrink: 0 }}
                  />
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      alignItems: "center",
                    }}
                  >
                    <span
                      style={{
                        marginRight: "5px",
                        color: isBusinessOpen(
                          business.open_hours,
                          business.close_hours
                        )
                          ? "#52c41a"
                          : "#ff4d4f",
                        fontWeight: "bold",
                      }}
                    >
                      {isBusinessOpen(business.open_hours, business.close_hours)
                        ? "Đang mở cửa"
                        : "Đã đóng cửa"}
                    </span>
                    <span style={{ whiteSpace: "nowrap" }}>
                      {business.open_hours || "0"} -{" "}
                      {business.close_hours || "0"}
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </Col>
      ))}
    </Row>
  );
};

export default BusinessInHomePage;
