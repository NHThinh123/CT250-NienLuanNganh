import { Col, Row, Card } from "antd";
import { CircleDollarSign, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import BoxContainer from "../../../../components/atoms/BoxContainer";
import Rating from "react-rating";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar as solidStar } from "@fortawesome/free-solid-svg-icons";
import { faStar as regularStar } from "@fortawesome/free-regular-svg-icons";
import BusinessPagination from "../molecules/BusinessPagination";

const removeAccents = (str) => {
  return str
    .toString()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D");
};

const isBusinessOpen = (openHours, closeHours) => {
  if (!openHours || !closeHours) return false;

  const now = new Date();
  const currentHours = now.getHours();
  const currentMinutes = now.getMinutes();
  const currentTimeInMinutes = currentHours * 60 + currentMinutes;

  const [openHour, openMinute] = openHours.split(":").map(Number);
  const [closeHour, closeMinute] = closeHours.split(":").map(Number);
  const openTimeInMinutes = openHour * 60 + openMinute;
  const closeTimeInMinutes = closeHour * 60 + closeMinute;

  if (closeTimeInMinutes < openTimeInMinutes) {
    return (
      currentTimeInMinutes >= openTimeInMinutes ||
      currentTimeInMinutes < closeTimeInMinutes
    );
  }

  return (
    currentTimeInMinutes >= openTimeInMinutes &&
    currentTimeInMinutes < closeTimeInMinutes
  );
};

const BusinessList = ({
  businessData,
  searchKeyword,
  typeSortOption,
  sortOption,
  starFilters,
  currentPage,
  itemsPerPage,
  priceRange,
  setFilteredTotalItems,
  onPageChange, // Thêm prop để xử lý phân trang
}) => {
  const navigate = useNavigate();

  const filterByRating = (business) => {
    if (starFilters.length === 0) return true;
    const rating = business.rating_average || 0;
    return (
      (starFilters.includes("0_to_1_star") && rating >= 0 && rating <= 1) ||
      (starFilters.includes("1_to_2_star") && rating >= 1 && rating <= 2) ||
      (starFilters.includes("2_to_3_star") && rating >= 2 && rating <= 3) ||
      (starFilters.includes("3_to_4_star") && rating >= 3 && rating <= 4) ||
      (starFilters.includes("4_to_5_star") && rating >= 4 && rating <= 5)
    );
  };

  const filteredBusinessData = businessData
    .filter((business) => {
      const businessName = removeAccents(
        business.business_name || ""
      ).toLowerCase();
      const keyword = removeAccents(searchKeyword || "").toLowerCase();
      return businessName.includes(keyword);
    })
    .filter(filterByRating)
    .filter((business) => {
      return (
        business.dish_lowest_cost >= priceRange[0] &&
        business.dish_highest_cost <= priceRange[1]
      );
    });

  setFilteredTotalItems(filteredBusinessData.length);

  const sortedBusinessData = [...filteredBusinessData].sort((a, b) => {
    if (typeSortOption === "cost") {
      if (sortOption === "low_to_high") {
        return (a.dish_lowest_cost || 0) - (b.dish_lowest_cost || 0);
      } else if (sortOption === "high_to_low") {
        return (b.dish_highest_cost || 0) - (a.dish_highest_cost || 0);
      }
    } else if (typeSortOption === "star") {
      if (sortOption === "low_to_high") {
        return (a.rating_average || 0) - (b.rating_average || 0);
      } else if (sortOption === "high_to_low") {
        return (b.rating_average || 0) - (a.rating_average || 0);
      }
    } else if (typeSortOption === "reviews") {
      if (sortOption === "low_to_high") {
        return (a.totalReviews || 0) - (b.totalReviews || 0);
      } else if (sortOption === "high_to_low") {
        return (b.totalReviews || 0) - (a.totalReviews || 0);
      }
    }
    return 0;
  });

  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = sortedBusinessData.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const formatPrice = (price) => {
    if (typeof price !== "number" || isNaN(price)) {
      return "N/A";
    }
    return price.toLocaleString("vi-VN");
  };

  return (
    <BoxContainer>
      {paginatedData.length === 0 ? (
        <div style={{ textAlign: "center", padding: "20px" }}>
          <p style={{ fontSize: "16px", color: "#888" }}>
            Không có kết quả phù hợp với tìm kiếm/bộ lọc mà bạn đang tìm/chọn
          </p>
        </div>
      ) : (
        <>
          <Row
            gutter={[24, 24]}
            justify={paginatedData.length / 4 === 0 ? "space-between" : "start"}
          >
            {paginatedData.map((business) => (
              <Col
                key={business._id}
                xs={12}
                sm={12}
                md={8}
                lg={6}
                xl={6}
                style={{ display: "flex" }}
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
                          {isBusinessOpen(
                            business.open_hours,
                            business.close_hours
                          )
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
              </Col>
            ))}
          </Row>
          <div
            style={{
              marginTop: "24px",
              placeItems: "center",
            }}
          >
            <BusinessPagination
              totalItems={filteredBusinessData.length}
              itemsPerPage={itemsPerPage}
              onPageChange={onPageChange}
            />
          </div>
        </>
      )}
    </BoxContainer>
  );
};

export default BusinessList;
