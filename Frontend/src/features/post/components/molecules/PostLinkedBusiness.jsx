import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Card, Typography, Row, Col, Image } from "antd";
import { CircleDollarSign, Clock, MapPinHouse } from "lucide-react";
import Rating from "react-rating";
import { faStar as solidStar } from "@fortawesome/free-solid-svg-icons";
import { faStar as regularStar } from "@fortawesome/free-regular-svg-icons";
const { Text } = Typography;

const PostLinkedBusiness = ({ linked_business }) => {
  // Nếu không có linked_business, không hiển thị gì
  if (!linked_business) {
    return null;
  }
  const formatPrice = (price) => {
    if (typeof price !== "number" || isNaN(price)) {
      return "N/A";
    }
    return price.toLocaleString("vi-VN");
  };

  return (
    <Card
      style={{
        marginTop: 8,
        borderRadius: 8,
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
        margin: 16,
      }}
      title={<Text strong>{linked_business.business_name}</Text>}
    >
      <Row>
        <Col span={6}>
          <Image
            src={linked_business.avatar}
            alt="avatar"
            style={{ width: "auto", height: 100 }}
            preview={false}
          />
        </Col>
        <Col span={18} style={{ fontSize: 12 }}>
          <p
            style={{
              display: "flex",
              gap: 5,
              marginBottom: 4,
            }}
          >
            <Rating
              initialRating={linked_business.rating_average}
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
            />{" "}
            {linked_business.rating_average || "N/A"} / 5
          </p>
          <p style={{ marginBottom: 4 }}>
            <MapPinHouse
              size={15}
              style={{ marginRight: "8px" }}
              strokeWidth={1}
            />
            {linked_business.location || "Không có thông tin địa chỉ"}
          </p>
          <p
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: 4,
            }}
          >
            <CircleDollarSign
              size={15}
              style={{ marginRight: "8px" }}
              strokeWidth={1}
            />
            {formatPrice(linked_business.dish_lowest_cost)}đ -{" "}
            {formatPrice(linked_business.dish_highest_cost)}đ
          </p>
          <p>
            <Clock
              size={15}
              style={{ marginRight: "8px", marginBottom: -2 }}
              strokeWidth={1}
            />
            {linked_business.open_hours} - {linked_business.close_hours}
          </p>
        </Col>
      </Row>
    </Card>
  );
};

export default PostLinkedBusiness;
