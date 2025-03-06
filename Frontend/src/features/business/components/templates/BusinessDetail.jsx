import { Breadcrumb, Col, Row } from "antd";
import Rating from "react-rating";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar as solidStar } from "@fortawesome/free-solid-svg-icons";
import { faStar as regularStar } from "@fortawesome/free-regular-svg-icons";
import { BookUser, CircleDollarSign, Clock, MapPinHouse } from "lucide-react";

const BusinessDetail = ({ businessData, isLoading, isError }) => {
  //Hàm định dạng giá tiền
  const formatPrice = (price) => {
    if (typeof price !== "number" || isNaN(price)) {
      return "N/A"; // Hoặc trả về một giá trị mặc định
    }
    return price.toLocaleString("vi-VN"); // Thêm dấu chấm ngăn cách hàng nghìn
  };

  if (isLoading) {
    return <h1>Loading...</h1>;
  }
  if (isError) {
    return <h1>Error...</h1>;
  }
  return (
    <>
      <div style={styles.businessPage}>
        <Row>
          <Col span={3}></Col>
          <Col span={9}>
            <div style={styles.businessAva}>
              <img
                style={{ width: "500px", height: "250px", borderRadius: 5 }}
                src={businessData.avatar}
                alt="Ảnh"
              ></img>
            </div>
          </Col>
          <Col span={9}>
            <div style={styles.businessDetail}>
              <br />
              <div style={styles.businessBreadcrumb}>
                <Breadcrumb
                  separator=">"
                  items={[
                    {
                      title: "Trang chủ",
                    },
                    {
                      title: "Quán ăn",
                      href: "/businesses",
                    },
                    {
                      title: `${businessData.business_name}`,
                    },
                  ]}
                />
              </div>
              <div>
                <p style={styles.businessName}>{businessData.business_name}</p>
              </div>
              <div style={styles.businessRating}>
                <Rating
                  initialRating={businessData.rating_average}
                  readonly
                  emptySymbol={
                    <FontAwesomeIcon
                      icon={regularStar}
                      style={{ fontSize: 20, color: "#ccc" }}
                    />
                  }
                  fullSymbol={
                    <FontAwesomeIcon
                      icon={solidStar}
                      style={{ fontSize: 20, color: "#FFD700" }}
                    />
                  }
                  fractions={10} // Hiển thị giá trị chính xác đến 0.1
                  quiet={true}
                />
                <div
                  style={{
                    fontSize: 15,
                    marginLeft: 6,
                    fontWeight: "bold",
                  }}
                >
                  <p>{businessData.rating_average}/5</p>
                </div>
              </div>
              <div style={styles.businessLocation}>
                <p>
                  <MapPinHouse
                    size={20}
                    style={{ marginRight: "5px", marginBottom: "-3px" }}
                  />
                  {businessData.location}
                </p>
              </div>
              <div style={styles.businessContactInfo}>
                <p>
                  <BookUser
                    size={20}
                    style={{ marginRight: "5px", marginBottom: "-3px" }}
                  />
                  {businessData.contact_info}
                </p>
              </div>
              <div style={styles.businessTime}>
                <p>
                  <Clock
                    size={20}
                    style={{ marginRight: "5px", marginBottom: "-3px" }}
                  />
                  {businessData.open_hours} - {businessData.close_hours}
                </p>
              </div>
              <div>
                <p>
                  <CircleDollarSign
                    size={20}
                    style={{ marginRight: "5px", marginBottom: "-3px" }}
                  />
                  {formatPrice(businessData.dish_lowest_cost)}đ -{" "}
                  {formatPrice(businessData.dish_highest_cost)}đ
                </p>
              </div>
              <br />
              {/* <hr style={{ height: "2px", border: "no", opacity: "0.5" }} /> */}
            </div>
          </Col>
          <Col span={3}></Col>
        </Row>
      </div>
    </>
  );
};

const styles = {
  businessPage: {
    backgroundColor: "#ffffff",
  },
  businessAva: {
    margin: "18px 0px 25px 0px",
  },
  businessDetail: {
    margin: "0px",
  },
  businessBreadcrumb: {
    marginBottom: "7px",
  },
  businessName: {
    fontSize: "25px",
    fontWeight: "bold",
    color: "#464646",
    marginBottom: "10px",
    cursor: "text",
  },
  businessRating: {
    display: "flex",
    marginBottom: "14px",
  },
  businessTime: {
    fontSize: "15px",
    color: "#252525",
    marginBottom: "14px",
  },
  businessLocation: {
    fontSize: "15px",
    color: "#252525",
    marginBottom: "14px",
    cursor: "text",
  },
  businessContactInfo: {
    fontSize: "15px",
    color: "#252525",
    marginBottom: "14px",
    cursor: "text",
  },
};

export default BusinessDetail;
