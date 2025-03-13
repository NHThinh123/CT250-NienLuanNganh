import { Breadcrumb, Col, Row, Button, Modal, Card, Typography, Tag, Space } from "antd"; // Thêm Card, Typography, Tag, Space
import Rating from "react-rating";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar as solidStar } from "@fortawesome/free-solid-svg-icons";
import { faStar as regularStar } from "@fortawesome/free-regular-svg-icons";
import { BookUser, CircleDollarSign, Clock, MapPinHouse, DollarSign, Store, BadgeDollarSign } from "lucide-react"; // Thêm DollarSign
import { useState, useEffect, useRef } from "react";
import ProfileBusinessPage from "../../../../pages/ProfileBusinessPage";
import { Map as ReactMapGL, Marker } from "react-map-gl";
import { useNavigate } from "react-router-dom";
import MapboxDirections from "@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions";
import "mapbox-gl/dist/mapbox-gl.css";
import "@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions.css";

const { Title, Text } = Typography;


const CustomMarker = ({ longitude = 0, latitude = 0, color = "red", ...props }) => (
  <Marker longitude={longitude} latitude={latitude} color={color} {...props} />
);

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

  const formatPrice = (price) => {
    if (typeof price !== "number" || isNaN(price)) {
      return "N/A";
    }
    return price.toLocaleString("vi-VN");
  };

  const formatDate = (date) => {
    if (!date) return "Chưa có thông tin";
    return new Date(date).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const getPaymentStatus = () => {
    if (!businessData.nextPaymentDueDate) return { text: "Chưa kích hoạt", color: "orange" };
    const today = new Date();
    const dueDate = new Date(businessData.nextPaymentDueDate);
    return today > dueDate
      ? { text: "Quá hạn", color: "red" }
      : { text: "Đã thanh toán", color: "green" };
  };

  if (isLoading) {
    return <h1 style={styles.loadingText}>Loading...</h1>;
  }
  if (isError) {
    return <h1 style={styles.errorText}>Error...</h1>;
  }

  const handleEdit = () => {
    setIsModalOpen(true);
  };

  const handlePaymentStatus = () => {
    setIsPaymentModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handlePaymentModalClose = () => {
    setIsPaymentModalOpen(false);
  };

  const handlePaymentClick = () => {
    navigate(`/subscription/plans/${businessData._id}`, {
      state: {
        businessId: businessData._id,
        email: businessData.email,
        businessName: businessData.business_name,
        fromBusinessDetail: true,
      },
    });
    setIsPaymentModalOpen(false);
  };

  const coordinates = businessData.address?.coordinates || [0, 0];
  const longitude = Number(coordinates[0]);
  const latitude = Number(coordinates[1]);
  const mapboxToken = import.meta.env.VITE_TOKENMAPBOX;

  useEffect(() => {
    if (!mapRef.current || !mapboxToken || isNaN(longitude) || isNaN(latitude)) {
      console.error("Cannot initialize directions:", {
        map: !!mapRef.current,
        token: !!mapboxToken,
        longitude,
        latitude,
      });
      return;
    }

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
          <Button type="primary" onClick={handleEdit} style={{ marginBottom: "10px" }}>
            Chỉnh sửa thông tin
          </Button>
          <Button type="primary" onClick={handlePaymentStatus}>
            Trạng thái thanh toán
          </Button>
        </div>
      )}

      {/* Các phần khác giữ nguyên */}
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
                {businessData.location || "Không có thông tin địa chỉ"}
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
        <Col span={4}></Col>
        <Col span={2}></Col>
      </Row>

      <Row style={{ marginTop: "20px" }}>
        <Col span={2}></Col>
        <Col span={20}>
          <div style={styles.mapContainer}>
            {mapboxToken && !isNaN(longitude) && !isNaN(latitude) ? (
              <ReactMapGL
                ref={mapRef}
                initialViewState={{
                  longitude: longitude,
                  latitude: latitude,
                  zoom: 14,
                }}
                style={{ width: "100%", height: "300px" }}
                mapStyle="mapbox://styles/mapbox/streets-v11"
                mapboxAccessToken={mapboxToken}
                scrollZoom={true}
                doubleClickZoom={false}
                dragPan={true}
              >
                <CustomMarker longitude={longitude} latitude={latitude} color="red" />
              </ReactMapGL>
            ) : (
              <p style={styles.errorText}>
                Không thể hiển thị bản đồ: {mapboxToken ? "Tọa độ không hợp lệ" : "Thiếu Mapbox token"}
              </p>
            )}
          </div>
        </Col>
        <Col span={2}></Col>
      </Row>

      <Modal
        title="Chỉnh sửa thông tin doanh nghiệp"
        open={isModalOpen}
        onCancel={handleModalClose}
        footer={null}
        width={800}
      >
        <ProfileBusinessPage
          businessId={businessData.id}
          onClose={handleModalClose}
        />
      </Modal>

      {/* Modal trạng thái thanh toán hiện đại */}
      <Modal
        title={
          <Title level={4} style={{ margin: 0, color: "#52c41a" }}>
            Trạng thái thanh toán
          </Title>
        }
        open={isPaymentModalOpen}
        onCancel={handlePaymentModalClose}
        footer={[
          <Button
            key="register"
            type="primary"
            style={{
              backgroundColor: "#52c41a",
              borderColor: "#52c41a",
              borderRadius: "5px",
              height: "40px",
              fontWeight: "bold"
            }}
            onClick={handlePaymentClick} // Bạn cần định nghĩa hàm này trong component
          >
            Thanh Toán
          </Button>,
          <Button
            key="cancel"
            onClick={handlePaymentModalClose}
            style={{
              borderRadius: "5px",
              height: "35px"
            }}
          >
            Đóng
          </Button>
        ]}
        width={600}
        bodyStyle={{ padding: "20px", backgroundColor: "#f5f5f5" }}
      >
        <Card
          style={{
            borderRadius: "10px",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
            background: "linear-gradient(135deg, #ffffff 0%, #f9f9f9 100%)",
          }}
        >
          <Space direction="vertical" size="large" style={{ width: "100%" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <Text strong style={{ fontSize: "16px", color: "#555", display: "flex", alignItems: "center" }}>
                <Store color="#52c41a" strokeWidth={1.5} size={18} style={{ marginRight: "8px", verticalAlign: "middle" }} />
                Doanh nghiệp ẩm thực
              </Text>
              <Text style={{ fontSize: "16px", color: "#333", lineHeight: "18px", fontWeight: "bolder" }}>
                {businessData.business_name}
              </Text>
            </div>

            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <Text strong style={{ fontSize: "16px", color: "#555", display: "flex", alignItems: "center" }}>
                <BadgeDollarSign color="#52c41a" strokeWidth={1.5} size={18} style={{ marginRight: "8px", verticalAlign: "middle" }} />
                Ngày thanh toán gần nhất
              </Text>
              <Text style={{ fontSize: "16px", color: "#333", lineHeight: "18px", fontWeight: "bolder" }}>
                {formatDate(businessData.lastPaymentDate)}
              </Text>
            </div>

            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <Text strong style={{ fontSize: "16px", color: "#555", display: "flex", alignItems: "center" }}>
                <BadgeDollarSign color="#52c41a" strokeWidth={1.5} size={18} style={{ marginRight: "8px", verticalAlign: "middle" }} />
                Ngày thanh toán tiếp theo
              </Text>
              <Text style={{ fontSize: "16px", color: "#333", lineHeight: "18px", fontWeight: "bolder" }}>
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
    padding: "20px",
    position: "relative",
  },
  editButtonContainer: {
    position: "absolute",
    top: "20px",
    right: "30px",
    zIndex: 10,
    display: "flex",
    flexDirection: "column",
    gap: "10px",
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
    fontSize: "16px",
    fontWeight: "bold",
    color: "red",
  },
  mapContainer: {
    width: "100%",
    height: "300px",
    borderRadius: "5px",
    overflow: "hidden",
  },
};

export default BusinessDetail;