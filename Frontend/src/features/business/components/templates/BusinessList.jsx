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

const BusinessList = ({
  businessData,
  searchKeyword,
  sortOption,
  starFilters,
  currentPage,
  itemsPerPage,
  setFilteredTotalItems,
}) => {
  const navigate = useNavigate();

  // Hàm lọc businesses theo rating
  const filterByRating = (business) => {
    if (starFilters.length === 0) return true; // Nếu không chọn bộ lọc, hiển thị tất cả
    const rating = business.rating_average || 0;
    return (
      (starFilters.includes("from_3_stars") && rating >= 3) ||
      (starFilters.includes("from_4_stars") && rating >= 4) ||
      (starFilters.includes("from_5_stars") && rating >= 5)
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
    .filter(filterByRating);

  // Cập nhật số lượng business sau khi lọc để phân trang chính xác
  setFilteredTotalItems(filteredBusinessData.length);

  // Sắp xếp danh sách businesses theo tùy chọn của người dùng
  const sortedBusinessData = [...filteredBusinessData].sort((a, b) => {
    if (sortOption === "high_to_low_reviews") {
      return (b.totalReviews || 0) - (a.totalReviews || 0);
    }
    if (sortOption === "low_to_high_cost") {
      return (a.dish_lowest_cost || 0) - (b.dish_lowest_cost || 0);
    }
    if (sortOption === "high_to_low_cost") {
      return (b.dish_highest_cost || 0) - (a.dish_highest_cost || 0);
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
                {business.rating_average || "N/A"}
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
                ({business.totalReviews || "N/A"})
              </p>
              <p
                style={{
                  marginTop: "8px",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <Clock size={18} style={{ marginRight: "8px" }} />
                {business.open_hours || "N/A"} - {business.close_hours || "N/A"}
              </p>
            </Card>
          </Col>
        ))}
      </Row>
    </BoxContainer>
  );
};

export default BusinessList;
