import { useState } from "react";
import { Col, Row, Carousel, Modal, Button } from 'antd';

const DishDetail = ({dishData, isLoading, isError}) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedImage, setSelectedImage] = useState("");
    const [isZoomed, setIsZoomed] = useState(false);

    if (isLoading) {
        return <h1>Loading...</h1>;
    }
    if (isError) {
        return <h1>Error...</h1>;
    }
    //Hàm xử lý khi click vào ảnh
    const handleImageClick = (url) => {
        setSelectedImage(url);
        setIsModalOpen(true);
    };
    //Hàm xử lý khi click vào nút đóng modal
    const handleCloseModal = () => {
        setIsModalOpen(false);
        setIsZoomed(false);
    };
    //Hàm định dạng giá tiền
    const formatPrice = (price) => {
        return price.toLocaleString("vi-VN"); // Thêm dấu chấm ngăn cách hàng nghìn
    };
  return (
    <>
        <div style={styles.dishPage}>
            <Row>
                <Col span={3}>
                </Col>
                <Col span={9}>
                    {dishData.dish_url && dishData.dish_url.length > 0 ? (
                        <Carousel arrows infinite={false} style={{ margin: "20px" }}>
                            {dishData.dish_url.map((url, index) => (
                                <div key={index} onClick={() => handleImageClick(url)} style={styles.carouselItem}>
                                    <img
                                        src={url}
                                        alt={`${dishData.dish_name} - ${index + 1}`}
                                        style={styles.carouselImage}
                                    />
                                </div>
                            ))}
                        </Carousel>
                    ) : (
                        <p style={styles.noImageText}>Không có ảnh</p>
                    )}
                    <Modal
                        open={isModalOpen}
                        footer={null}
                        onCancel={handleCloseModal}
                        centered
                    >
                        <div style={styles.modalContainer}>
                            <img
                                src={selectedImage}
                                alt="Phóng to"
                                style={{
                                    ...styles.modalImage,
                                    width: isZoomed ? "100%" : "70%",
                                }}
                            />
                            <Button
                                onClick={() => setIsZoomed(!isZoomed)}
                                style={styles.zoomButton}
                            >
                                {isZoomed ? "Thu nhỏ" : "Phóng to"}
                            </Button>
                        </div>
                    </Modal>
                </Col>
                <Col span={9}>
                    <div style={styles.dishDetail}>
                        <p style={styles.dishName}>{dishData.dish_name}</p>
                        <p style={styles.dishPrice}>{formatPrice(dishData.dish_price)}đ</p>
                        <p style={styles.dishDescription}>Mô tả: {dishData.dish_description}</p>
                    </div>
                </Col>
                <Col span={3}>
                </Col>

            </Row>
        </div>
    </>
  )
}

const styles = {
    dishPage: {
        padding: "20px",
        backgroundColor: "#ffffff",
    },
    carouselItem: {
        cursor: "pointer",
        textAlign: "center",
    },
    carouselImage: {
        width: "100%",
        height: "300px",
        objectFit: "cover",
        borderRadius: "8px",
        transition: "transform 0.3s ease-in-out",
    },
    noImageText: {
        textAlign: "center",
        fontStyle: "italic",
        color: "gray",
    },
    modalContainer: {
        textAlign: "center",
        position: "relative",
    },
    modalImage: {
        height: "auto",
        borderRadius: "8px",
        transition: "all 0.3s ease-in-out",
    },
    zoomButton: {
        position: "absolute",
        top: 10,
        right: 10,
        zIndex: 10,
        backgroundColor: "#1890ff",
        color: "#fff",
        borderRadius: "4px",
        border: "none",
        cursor: "pointer",
        padding: "6px 12px",
    },
    dishDetail: {
        marginTop: "30px",
        paddingLeft: "30px",
        
    },
    dishName: {
        fontSize: "30px",
        fontWeight: "bold",
    },
    dishPrice: {
        fontSize: "30px",
        margin: "5px 0",
        color: "#d0011b",
    },
    dishDescription: {
        fontSize: "16px",
        margin: "5px 0",
    },
};

export default DishDetail;
