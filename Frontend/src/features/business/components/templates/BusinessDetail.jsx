import {
  Breadcrumb,
  Col,
  Row,
  Button,
  Modal,
  Card,
  Typography,
  Space,
  Drawer,
  Divider,
  message,
  Avatar,
} from "antd";
import Rating from "react-rating";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar as solidStar } from "@fortawesome/free-solid-svg-icons";
import { faStar as regularStar } from "@fortawesome/free-regular-svg-icons";
import {
  BookUser,
  CircleDollarSign,
  Clock,
  MapPinHouse,
  Store,
  BadgeDollarSign,
  MessageCircle,
  AlignJustify,
  Check,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import ProfileBusinessPage from "../../../../pages/ProfileBusinessPage";
import { Map as ReactMapGL, Marker } from "react-map-gl";
import { useNavigate } from "react-router-dom";
import MapboxDirections from "@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions";
import "mapbox-gl/dist/mapbox-gl.css";
import "@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions.css";

const { Title, Text } = Typography;

const CustomMarker = ({
  longitude = 0,
  latitude = 0,
  color = "red",
  ...props
}) => (
  <Marker longitude={longitude} latitude={latitude} color={color} {...props} />
);

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

const BusinessDetail = ({
  businessData,
  isLoading,
  isError,
  canEdit = false,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const mapRef = useRef(null);
  const directionsRef = useRef(null);
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const formatPrice = (price) => {
    if (typeof price !== "number" || isNaN(price)) return "N/A";
    return price.toLocaleString("vi-VN");
  };

  const showDrawer = () => setOpen(true);
  const onClose = () => setOpen(false);

  const formatDate = (date) => {
    if (!date) return "Chưa có thông tin";
    return new Date(date).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const getDaysUntilDueDate = () => {
    if (!businessData.nextPaymentDueDate) return Infinity;
    const today = new Date();
    const dueDate = new Date(businessData.nextPaymentDueDate);
    const timeDiff = dueDate - today;
    return Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
  };

  if (isLoading) return <h1 style={styles.loadingText}>Loading...</h1>;
  if (isError) return <h1 style={styles.errorText}>Error...</h1>;

  const handleEdit = () => setIsModalOpen(true);
  const handlePaymentStatus = () => setIsPaymentModalOpen(true);
  const handleModalClose = () => setIsModalOpen(false);
  const handlePaymentModalClose = () => setIsPaymentModalOpen(false);

  const handlePaymentClick = () => {
    const daysUntilDue = getDaysUntilDueDate();
    if (daysUntilDue <= 3) {
      navigate(`/subscription/plans/${businessData._id}`, {
        state: {
          businessId: businessData._id,
          email: businessData.email,
          businessName: businessData.business_name,
          fromBusinessDetail: true,
        },
      });
      setIsPaymentModalOpen(false);
    } else {
      message.warning("Chưa đến hạn thanh toán!");
    }
  };

  const coordinates = businessData.address?.coordinates || [0, 0];
  const longitude = Number(coordinates[0]);
  const latitude = Number(coordinates[1]);
  const mapboxToken = import.meta.env.VITE_TOKENMAPBOX;

  useEffect(() => {
    if (!mapRef.current || !mapboxToken || isNaN(longitude) || isNaN(latitude))
      return;

    mapRef.current.flyTo({
      center: [longitude, latitude],
      zoom: 14,
      duration: 0,
    });

    const directions = new MapboxDirections({
      accessToken: mapboxToken,
      unit: "metric",
      profile: "mapbox/driving",
      interactive: false,
      controls: { inputs: false, instructions: true },
    });

    directionsRef.current = directions;
    mapRef.current.addControl(directions, "top-left");
    directions.setDestination([longitude, latitude]);

    const handleMapClick = (event) => {
      const { lng, lat } = event.lngLat;
      directions.setOrigin([lng, lat]);
    };

    mapRef.current.on("click", handleMapClick);

    return () => {
      if (mapRef.current) {
        mapRef.current.off("click", handleMapClick);
        mapRef.current.removeControl(directions);
      }
    };
  }, [mapboxToken, longitude, latitude]);

  return (
    <div style={styles.businessPage}>
      {canEdit && (
        <div style={styles.editButtonContainer}>
          <Button type="text" onClick={showDrawer} style={styles.editButton}>
            <AlignJustify style={{ color: "#000000" }} />
          </Button>
          <Drawer
            title={
              <Title level={4} style={{ margin: 0, color: "#1a1a1a" }}>
                Tùy Chọn
              </Title>
            }
            placement="right"
            onClose={onClose}
            open={open}
            width={window.innerWidth < 768 ? "60%" : 300}
            style={styles.drawer}
          >
            <Space direction="vertical" style={{ width: "100%" }}>
              <Button
                type="text"
                onClick={handleEdit}
                block
                style={styles.drawerButton}
              >
                Chỉnh sửa thông tin
              </Button>
              <Button
                type="text"
                onClick={handlePaymentStatus}
                block
                style={styles.drawerButton}
              >
                Trạng thái thanh toán
              </Button>
            </Space>
          </Drawer>
        </div>
      )}
      <Row gutter={[32, 0]}>
        <Col xs={0} sm={2} md={1} lg={2} xl={2}></Col>
        <Col
          xs={24}
          sm={20}
          md={11}
          lg={10}
          xl={10}
          style={{ placeContent: "center" }}
        >
          <div style={styles.businessAva}>
            <Avatar
              style={styles.businessImage}
              src={businessData.avatar}
              alt="Ảnh"
            />
          </div>
        </Col>
        <Col xs={0} sm={2} md={0} lg={0} xl={0}></Col>
        <Col xs={0} sm={2} md={0} lg={0} xl={0}></Col>
        <Col
          xs={24}
          sm={20}
          md={11}
          lg={10}
          xl={10}
          style={{ placeContent: "center" }}
        >
          <div style={styles.businessDetail}>
            <div style={styles.businessBreadcrumb}>
              <Breadcrumb
                separator=">"
                items={[
                  { title: "Trang chủ", href: "/" },
                  { title: "Quán ăn", href: "/businesses" },
                  { title: businessData.business_name },
                ]}
              />
            </div>
            <p style={styles.businessName}>{businessData.business_name}</p>
            <div style={styles.businessRating}>
              <Rating
                initialRating={businessData.rating_average}
                readonly
                emptySymbol={
                  <FontAwesomeIcon icon={regularStar} style={styles.starIcon} />
                }
                fullSymbol={
                  <FontAwesomeIcon
                    icon={solidStar}
                    style={styles.starIconFull}
                  />
                }
                fractions={10}
                quiet={true}
              />
              <p style={styles.ratingText}>{businessData.rating_average}/5</p>
            </div>
            <p style={styles.businessTotalReviews}>
              <MessageCircle size={20} style={styles.icon} />
              {businessData.totalReviews || "0"} lượt đánh giá
            </p>
            <p style={styles.businessLocation}>
              <MapPinHouse size={20} style={styles.icon} />
              {businessData.location || "Không có thông tin địa chỉ"}
            </p>
            <p style={styles.businessContactInfo}>
              <BookUser size={20} style={styles.icon} />
              {businessData.contact_info}
            </p>
            <p style={styles.businessTime}>
              <Clock size={20} style={styles.icon} />
              <span
                style={{
                  ...styles.openStatus,
                  color: isBusinessOpen(
                    businessData.open_hours,
                    businessData.close_hours
                  )
                    ? "#52c41a"
                    : "#ff4d4f",
                }}
              >
                {isBusinessOpen(
                  businessData.open_hours,
                  businessData.close_hours
                )
                  ? "Đang mở cửa"
                  : "Đã đóng cửa"}
              </span>
              {businessData.open_hours} - {businessData.close_hours}
            </p>
            <p style={styles.businessPrice}>
              <CircleDollarSign size={20} style={styles.icon} />
              {formatPrice(businessData.dish_lowest_cost)}đ -{" "}
              {formatPrice(businessData.dish_highest_cost)}đ
            </p>
          </div>
        </Col>
        <Col xs={0} sm={2} md={1} lg={2} xl={2}></Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: "20px" }}>
        <Col xs={0} sm={0} md={1} lg={2}></Col>
        <Col
          xs={24}
          sm={24}
          md={22}
          lg={20}
          // offset={window.innerWidth < 768 ? 0 : 2}
        >
          <div style={styles.mapContainer}>
            {mapboxToken && !isNaN(longitude) && !isNaN(latitude) ? (
              <ReactMapGL
                ref={mapRef}
                initialViewState={{
                  longitude,
                  latitude,
                  zoom: 14,
                }}
                style={styles.map}
                mapStyle="mapbox://styles/mapbox/streets-v11"
                mapboxAccessToken={mapboxToken}
                scrollZoom={true}
                doubleClickZoom={false}
                dragPan={true}
              >
                <CustomMarker
                  longitude={longitude}
                  latitude={latitude}
                  color="red"
                />
              </ReactMapGL>
            ) : (
              <p style={styles.errorText}>
                Không thể hiển thị bản đồ:{" "}
                {mapboxToken ? "Tọa độ không hợp lệ" : "Thiếu Mapbox token"}
              </p>
            )}
          </div>
        </Col>
        <Col xs={0} sm={0} md={1} lg={2}></Col>
      </Row>

      <Modal
        title="Chỉnh sửa thông tin doanh nghiệp"
        open={isModalOpen}
        onCancel={handleModalClose}
        footer={null}
        width={window.innerWidth < 768 ? "90%" : 800}
      >
        <ProfileBusinessPage
          businessId={businessData.id}
          onClose={handleModalClose}
        />
      </Modal>

      <Modal
        title={
          <Title level={4} style={{ color: "#000" }}>
            Trạng thái thanh toán
          </Title>
        }
        open={isPaymentModalOpen}
        onCancel={handlePaymentModalClose}
        footer={[
          <Button
            key="register"
            type="primary"
            style={styles.paymentButton}
            onClick={handlePaymentClick}
          >
            Thanh Toán
          </Button>,
          <Button
            key="cancel"
            onClick={handlePaymentModalClose}
            style={styles.cancelButton}
          >
            Đóng
          </Button>,
        ]}
        width={window.innerWidth < 768 ? "90%" : 600}
      >
        <Divider orientation="left" orientationMargin="0">
          <span style={{ color: "#000" }}>Ưu Đãi</span>
        </Divider>
        <ul style={styles.benefitsList}>
          <li style={styles.benefitItem}>
            <Check
              color="#52c41a"
              strokeWidth={1.75}
              style={styles.checkIcon}
            />
            Quảng bá không giới hạn – Hiển thị nhà hàng/quán ăn của bạn trên nền
            tảng đánh giá ẩm thực hàng đầu.
          </li>
          <li style={styles.benefitItem}>
            <Check
              color="#52c41a"
              strokeWidth={1.75}
              style={styles.checkIcon}
            />
            Tiếp cận khách hàng tiềm năng – Kết nối với thực khách đang tìm kiếm
            địa điểm ăn uống chất lượng.
          </li>
          <li style={styles.benefitItem}>
            <Check
              color="#52c41a"
              strokeWidth={1.75}
              style={styles.checkIcon}
            />
            Tối ưu hóa đánh giá & thương hiệu – Thu hút đánh giá tích cực, nâng
            cao uy tín và độ tin cậy.
          </li>
          <li style={styles.benefitItem}>
            <Check
              color="#52c41a"
              strokeWidth={1.75}
              style={styles.checkIcon}
            />
            Chiến dịch khuyến mãi & ưu đãi độc quyền – Hỗ trợ các chương trình
            giảm giá, voucher để thu hút khách hàng mới.
          </li>
        </ul>
        <Card style={styles.paymentCard}>
          <Space direction="vertical" size="large" style={{ width: "100%" }}>
            <div style={styles.paymentInfo}>
              <Text strong style={styles.paymentLabel}>
                <Store
                  color="#52c41a"
                  strokeWidth={1.5}
                  size={18}
                  style={styles.paymentIcon}
                />
                Doanh nghiệp ẩm thực
              </Text>
              <Text style={styles.paymentValue}>
                {businessData.business_name}
              </Text>
            </div>
            <div style={styles.paymentInfo}>
              <Text strong style={styles.paymentLabel}>
                <BadgeDollarSign
                  color="#52c41a"
                  strokeWidth={1.5}
                  size={18}
                  style={styles.paymentIcon}
                />
                Ngày thanh toán gần nhất
              </Text>
              <Text style={styles.paymentValue}>
                {formatDate(businessData.lastPaymentDate)}
              </Text>
            </div>
            <div style={styles.paymentInfo}>
              <Text strong style={styles.paymentLabel}>
                <BadgeDollarSign
                  color="#52c41a"
                  strokeWidth={1.5}
                  size={18}
                  style={styles.paymentIcon}
                />
                Ngày thanh toán tiếp theo
              </Text>
              <Text style={styles.paymentValue}>
                {formatDate(businessData.nextPaymentDueDate)}
              </Text>
            </div>
          </Space>
        </Card>
      </Modal>
    </div>
  );
};

const styles = {
  businessPage: {
    backgroundColor: "#ffffff",
    padding: "20px 10px",
    position: "relative",
    minHeight: "100vh",
  },
  editButtonContainer: {
    position: "absolute",
    top: "10px",
    right: "10px",
    zIndex: 10,
  },
  editButton: {
    height: "30px",
    background: "#ffffff",
  },
  drawer: {
    borderRadius: "10px 0 0 10px",
    boxShadow: "0 8px 24px rgba(0, 0, 0, 0.15)",
    border: "none",
  },
  drawerButton: {
    height: "40px",
    borderRadius: "8px",
    border: "none",
    fontWeight: "500",
    transition: "all 0.3s",
    display: "flex",
    justifyContent: "flex-start",
    paddingLeft: "10px",
    textAlign: "left",
  },
  businessAva: {
    margin: "10px 0",
    width: "100%",
  },
  businessImage: {
    width: "100%",
    height: "auto",
    maxHeight: "300px",
    borderRadius: "5px",
    objectFit: "cover",
  },
  businessDetail: {
    margin: "0",
    width: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  },
  businessBreadcrumb: {
    marginBottom: "7px",
  },
  businessName: {
    fontSize: "clamp(18px, 6vw, 24px)", // Giảm từ 28px xuống 24px
    fontWeight: "bold",
    color: "#464646",
    marginBottom: "10px", // Tăng từ 0 lên 10px để cân đối với businessRating
    cursor: "text",
  },
  businessRating: {
    display: "flex",
    alignItems: "center",
    marginBottom: "10px", // Giữ nguyên, đồng bộ với các phần khác
  },
  starIcon: { fontSize: "clamp(16px, 4vw, 18px)", color: "#ccc" },
  starIconFull: { fontSize: "clamp(16px, 4vw, 18px)", color: "#FFD700" },
  ratingText: {
    fontSize: "clamp(12px, 4vw, 16px)", // Giảm max từ 18px xuống 16px cho cân đối
    margin: "0 0 0 10px",
    fontWeight: "bold",
  },
  businessTime: {
    fontSize: "clamp(12px, 4vw, 16px)", // Giảm max từ 18px xuống 16px
    color: "#252525",
    marginBottom: "10px", // Đồng bộ marginBottom
  },
  businessTotalReviews: {
    fontSize: "clamp(12px, 4vw, 16px)", // Giảm max từ 18px xuống 16px
    color: "#252525",
    marginBottom: "10px", // Đồng bộ marginBottom
  },
  businessLocation: {
    fontSize: "clamp(12px, 4vw, 16px)", // Giảm max từ 18px xuống 16px
    color: "#252525",
    cursor: "text",
    marginBottom: "10px", // Đồng bộ marginBottom
  },
  businessContactInfo: {
    fontSize: "clamp(12px, 4vw, 16px)", // Giảm max từ 18px xuống 16px
    color: "#252525",
    cursor: "text",
    marginBottom: "10px", // Đồng bộ marginBottom
  },
  businessPrice: {
    fontSize: "clamp(12px, 4vw, 16px)", // Giảm max từ 18px xuống 16px
    color: "#252525",
    marginBottom: "10px", // Đồng bộ marginBottom
  },
  openStatus: { marginRight: "10px", fontWeight: "bold" },
  icon: { marginRight: "5px", marginBottom: "-3px" },
  loadingText: {
    textAlign: "center",
    fontSize: "clamp(18px, 5vw, 24px)",
    fontWeight: "bold",
    color: "#1890ff",
  },
  errorText: {
    textAlign: "center",
    fontSize: "clamp(14px, 4vw, 16px)",
    fontWeight: "bold",
    color: "red",
  },
  mapContainer: {
    width: "100%",
    height: "clamp(200px, 50vw, 300px)", // Responsive height
    borderRadius: "5px",
    overflow: "hidden",
  },
  map: {
    width: "100%",
    height: "100%",
  },
  paymentButton: {
    backgroundColor: "#52c41a",
    borderColor: "#52c41a",
    borderRadius: "5px",
    height: "35px",
    fontWeight: "bold",
  },
  cancelButton: {
    borderRadius: "5px",
    height: "35px",
  },
  benefitsList: {
    paddingLeft: "20px",
    marginBottom: "20px",
    listStyle: "none",
  },
  benefitItem: {
    display: "flex",
    alignItems: "center",
    marginBottom: "8px",
  },
  checkIcon: { marginRight: "8px" },
  paymentCard: { borderRadius: "10px" },
  paymentInfo: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    flexWrap: "wrap",
  },
  paymentLabel: {
    fontSize: "clamp(14px, 3vw, 16px)",
    color: "#555",
    display: "flex",
    alignItems: "center",
  },
  paymentValue: {
    fontSize: "clamp(14px, 3vw, 16px)",
    color: "#333",
    lineHeight: "18px",
    fontWeight: "bolder",
  },
  paymentIcon: { marginRight: "8px", verticalAlign: "middle" },
};

export default BusinessDetail;
