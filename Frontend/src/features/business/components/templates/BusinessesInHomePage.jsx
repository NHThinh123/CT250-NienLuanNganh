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
                      fontSize: 18,
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
              <CircleDollarSign size={18} style={{ marginRight: "8px" }} />
              {formatPrice(business.dish_lowest_cost)}đ -{" "}
              {formatPrice(business.dish_highest_cost)}đ
            </p>
            <p
              style={{
                marginTop: "8px",
                display: "flex",
                gap: 5,
              }}
            >
              {business.rating_average || "0"}
              <Rating
                initialRating={business.rating_average}
                readonly
                emptySymbol={
                  <FontAwesomeIcon
                    icon={regularStar}
                    style={{ fontSize: 15, color: "#ccc" }}
                  />
                }
                fullSymbol={
                  <FontAwesomeIcon
                    icon={solidStar}
                    style={{ fontSize: 15, color: "#FFD700" }}
                  />
                }
                fractions={10}
                quiet={true}
              />
              ({business.totalReviews || "0"})
            </p>
            <p
              style={{
                marginTop: "8px",
                display: "flex",
                alignItems: "center",
              }}
            >
              <Clock size={18} style={{ marginRight: "8px" }} />
              <span
                style={{
                  marginRight: "5px",
                  color: isBusinessOpen(
                    business.open_hours,
                    business.close_hours
                  )
                    ? "#52c41a" // Màu xanh nếu đang mở
                    : "#ff4d4f", // Màu đỏ nếu đã đóng
                  fontWeight: "bold",
                }}
              >
                {isBusinessOpen(business.open_hours, business.close_hours)
                  ? "Đang mở cửa"
                  : "Đã đóng cửa"}
              </span>
              {business.open_hours || "0"} - {business.close_hours || "0"}
            </p>
          </Card>
        </Col>
      ))}
    </Row>
  );
};

export default BusinessInHomePage;
