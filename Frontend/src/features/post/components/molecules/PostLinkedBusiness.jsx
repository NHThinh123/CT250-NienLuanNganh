import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Card, Typography, Row, Col, Image } from "antd";
import { CircleDollarSign, Clock, MapPinHouse } from "lucide-react";
import Rating from "react-rating";
import { faStar as solidStar } from "@fortawesome/free-solid-svg-icons";
import { faStar as regularStar } from "@fortawesome/free-regular-svg-icons";
const { Text } = Typography;

const PostLinkedBusiness = ({ linked_business }) => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  // Theo dõi kích thước màn hình
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Nếu không có linked_business, không hiển thị gì
  if (!linked_business) {
    return null;
  }

  const formatPrice = (price) => {
    if (typeof price !== "number" || isNaN(price)) {
      return "0";
    }
    return price.toLocaleString("vi-VN");
  };

  return (
    <Card
      style={{
        marginTop: 8,
        borderRadius: 8,
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
        margin: windowWidth <= 576 ? 8 : 16, // Responsive margin
      }}
      title={
        <Text
          strong
          style={{
            fontSize:
              windowWidth <= 576
                ? "14px"
                : windowWidth <= 768
                ? "16px"
                : "18px", // Responsive font
          }}
        >
          Quán ăn: {linked_business.business_name}
        </Text>
      }
    >
      <Row gutter={[8, 8]} align="middle">
        {" "}
        {/* Thêm gutter để tạo khoảng cách */}
        <Col
          xs={8} // Mobile: 8/24 (~1/3 chiều rộng)
          sm={6} // Tablet nhỏ: 6/24 (~1/4 chiều rộng)
          md={6} // Tablet lớn/Desktop: 6/24
          style={{
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Image
            src={linked_business.avatar}
            alt="avatar"
            style={{
              width: "100%", // Chiếm toàn chiều rộng của Col
              height: windowWidth <= 576 ? 60 : windowWidth <= 768 ? 80 : 100, // Responsive height
              objectFit: "cover", // Giữ tỷ lệ ảnh
            }}
            preview={false}
          />
        </Col>
        <Col
          xs={16} // Mobile: 16/24 (~2/3 chiều rộng)
          sm={18} // Tablet nhỏ: 18/24 (~3/4 chiều rộng)
          md={18} // Tablet lớn/Desktop: 18/24
        >
          <p
            style={{
              display: "flex",
              alignItems: "center",
              gap: 5,
              marginBottom: windowWidth <= 576 ? 2 : 4, // Responsive margin
              fontSize: windowWidth <= 576 ? "12px" : "14px", // Responsive font
            }}
          >
            <Rating
              initialRating={linked_business.rating_average}
              readonly
              emptySymbol={
                <FontAwesomeIcon
                  icon={regularStar}
                  style={{
                    fontSize: windowWidth <= 576 ? 12 : 15, // Responsive icon
                    color: "#ccc",
                  }}
                />
              }
              fullSymbol={
                <FontAwesomeIcon
                  icon={solidStar}
                  style={{
                    fontSize: windowWidth <= 576 ? 12 : 15, // Responsive icon
                    color: "#FFD700",
                  }}
                />
              }
              fractions={10}
              quiet={true}
            />{" "}
            {linked_business.rating_average || "0"} / 5
          </p>
          <p
            style={{
              marginBottom: windowWidth <= 576 ? 2 : 4,
              fontSize: windowWidth <= 576 ? "12px" : "14px",
              display: "flex",
              alignItems: "center",
            }}
          >
            <MapPinHouse
              size={windowWidth <= 576 ? 12 : 15} // Responsive icon
              style={{ marginRight: "8px" }}
              strokeWidth={1}
            />
            {linked_business.location || "Không có thông tin địa chỉ"}
          </p>
          <p
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: windowWidth <= 576 ? 2 : 4,
              fontSize: windowWidth <= 576 ? "12px" : "14px",
            }}
          >
            <CircleDollarSign
              size={windowWidth <= 576 ? 12 : 15} // Responsive icon
              style={{ marginRight: "8px" }}
              strokeWidth={1}
            />
            {formatPrice(linked_business.dish_lowest_cost)}đ -{" "}
            {formatPrice(linked_business.dish_highest_cost)}đ
          </p>
          <p
            style={{
              display: "flex",
              alignItems: "center",
              fontSize: windowWidth <= 576 ? "12px" : "14px",
            }}
          >
            <Clock
              size={windowWidth <= 576 ? 12 : 15} // Responsive icon
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
