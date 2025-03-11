import { Breadcrumb, Col, Row, Button, Modal } from "antd"; // Thêm Modal
import Rating from "react-rating";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar as solidStar } from "@fortawesome/free-solid-svg-icons";
import { faStar as regularStar } from "@fortawesome/free-regular-svg-icons";
import { BookUser, CircleDollarSign, Clock, MapPinHouse } from "lucide-react";
import { useState } from "react";
import ProfileBusinessPage from "../../../../pages/ProfileBusinessPage";

const BusinessDetail = ({
  businessData,
  isLoading,
  isError,
  canEdit = false,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false); // Trạng thái modal

  const formatPrice = (price) => {
    if (typeof price !== "number" || isNaN(price)) {
      return "N/A";
    }
    return price.toLocaleString("vi-VN");
  };

  if (isLoading) {
    return <h1 style={styles.loadingText}>Loading...</h1>;
  }
  if (isError) {
    return <h1 style={styles.errorText}>Error...</h1>;
  }

  // Hàm mở modal
  const handleEdit = () => {
    setIsModalOpen(true);
  };

  // Hàm đóng modal
  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  return (
    <div style={styles.businessPage}>
      {canEdit && (
        <div style={styles.editButtonContainer}>
          <Button type="primary" onClick={handleEdit}>
            Chỉnh sửa
          </Button>
        </div>
      )}

      <Row>
        <Col span={2}></Col>
        <Col span={7}>
          <div style={styles.businessAva}>
            <img
              style={styles.businessImage}
              src={businessData.avatar}
              alt="Ảnh"
            />
          </div>
        </Col>
        <Col span={7}>
          <div style={styles.businessDetail}>
            <div style={styles.businessBreadcrumb}>
              <Breadcrumb
                separator=">"
                items={[
                  { title: "Trang chủ" },
                  { title: "Quán ăn", href: "/businesses" },
                  { title: `${businessData.business_name}` },
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
                fractions={10}
                quiet={true}
              />
              <p style={styles.ratingText}>{businessData.rating_average}/5</p>
            </div>
            <div style={styles.businessLocation}>
              <p>
                <MapPinHouse size={20} style={styles.icon} />
                {businessData.location}
              </p>
            </div>
            <div style={styles.businessContactInfo}>
              <p>
                <BookUser size={20} style={styles.icon} />
                {businessData.contact_info}
              </p>
            </div>
            <div style={styles.businessTime}>
              <p>
                <Clock size={20} style={styles.icon} />
                {businessData.open_hours} - {businessData.close_hours}
              </p>
            </div>
            <div>
              <p>
                <CircleDollarSign size={20} style={styles.icon} />
                {formatPrice(businessData.dish_lowest_cost)}đ -{" "}
                {formatPrice(businessData.dish_highest_cost)}đ
              </p>
            </div>
          </div>
        </Col>
        <Col span={4}>
          <div style={{ backgroundColor: "red" }}></div>
        </Col>
        <Col span={2}></Col>
      </Row>

      <Modal
        title="Chỉnh sửa thông tin doanh nghiệp"
        open={isModalOpen}
        onCancel={handleModalClose}
        footer={null} // Tắt footer mặc định nếu không cần nút OK/Cancel mặc định
        width={800} // Tùy chỉnh kích thước modal
      >
        <ProfileBusinessPage
          businessId={businessData.id}
          onClose={handleModalClose}
        />
      </Modal>
    </div>
  );
};

const styles = {
  businessPage: {
    backgroundColor: "#ffffff",
    padding: "20px 0px",
    position: "relative",
  },
  editButtonContainer: {
    position: "absolute",
    top: "20px",
    right: "30px",
    zIndex: 10,
  },
  businessAva: {
    margin: "18px 0px 25px 0px",
    width: "90%",
  },
  businessImage: {
    width: "100%",
    maxWidth: "500px",
    height: "250px",
    borderRadius: "5px",
    objectFit: "cover",
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
    alignItems: "center",
    marginBottom: "14px",
  },
  ratingText: {
    fontSize: "15px",
    margin: "0px 0px 0px 6px",
    fontWeight: "bold",
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
  icon: {
    marginRight: "5px",
    marginBottom: "-3px",
  },
  loadingText: {
    textAlign: "center",
    fontSize: "24px",
    fontWeight: "bold",
    color: "#1890ff",
  },
  errorText: {
    textAlign: "center",
    fontSize: "24px",
    fontWeight: "bold",
    color: "red",
  },
};

export default BusinessDetail;
