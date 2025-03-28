import { Col, Row, Card } from "antd";
import { CircleDollarSign, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import BoxContainer from "../../../../components/atoms/BoxContainer";
import Rating from "react-rating";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar as solidStar } from "@fortawesome/free-solid-svg-icons";
import { faStar as regularStar } from "@fortawesome/free-regular-svg-icons";

const removeAccents = (str) => {
  // Ensure str is a string before calling normalize
  return str
    .toString() // Convert to string if it’s not already
    .normalize("NFD") // Normalize to decompose accents
    .replace(/[\u0300-\u036f]/g, "") // Remove diacritical marks
    .replace(/đ/g, "d") // Replace Vietnamese 'đ' with 'd'
    .replace(/Đ/g, "D"); // Replace Vietnamese 'Đ' with 'D'
};

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
}) => {
  const navigate = useNavigate();

  // Hàm lọc businesses theo rating
  const filterByRating = (business) => {
    if (starFilters.length === 0) return true; // Nếu không chọn bộ lọc, hiển thị tất cả
    const rating = business.rating_average || 0;
    return (
      (starFilters.includes("0_to_1_star") && rating >= 0 && rating <= 1) ||
      (starFilters.includes("1_to_2_star") && rating >= 1 && rating <= 2) ||
      (starFilters.includes("2_to_3_star") && rating >= 2 && rating <= 3) ||
      (starFilters.includes("3_to_4_star") && rating >= 3 && rating <= 4) ||
      (starFilters.includes("4_to_5_star") && rating >= 4 && rating <= 5)
    );
  };

  // Lọc businesses theo từ khóa và đánh giá
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

  // Cập nhật số lượng business sau khi lọc để phân trang chính xác
  setFilteredTotalItems(filteredBusinessData.length);

  // Sắp xếp danh sách businesses theo tùy chọn của người dùng
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
    return 0; // Nếu không chọn gì thì giữ nguyên thứ tự
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

  if (paginatedData.length === 0) {
    return (
      <BoxContainer style={{ textAlign: "center", padding: "20px" }}>
        <p style={{ fontSize: "16px", color: "#888" }}>
          Không có kết quả phù hợp với tìm kiếm/bộ lọc mà bạn đang tìm/chọn
        </p>
      </BoxContainer>
    );
  }

  return (
    <BoxContainer>
      <Row
        gutter={[24, 24]}
        justify={paginatedData.length / 4 == 0 ? "space-between" : "start"}
      >
        {paginatedData.map((business) => (
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
    </BoxContainer>
  );
};

export default BusinessList;
