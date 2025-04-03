import { Row } from "antd";
import banner1 from "../../../../assets/banner/banner1.png";
import banner2 from "../../../../assets/banner/banner2.jpeg";
import banner3 from "../../../../assets/banner/banner3.png";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import "swiper/css/thumbs";
import { FreeMode, Navigation, Thumbs, Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { useState, useEffect } from "react";

const BannerHome = () => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  // Theo dõi kích thước màn hình
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Hàm tính chiều cao banner dựa trên kích thước màn hình
  const getBannerHeight = () => {
    if (windowWidth <= 576) return "150px"; // Mobile nhỏ
    if (windowWidth <= 768) return "200px"; // Tablet nhỏ
    if (windowWidth <= 992) return "250px"; // Tablet lớn/Desktop nhỏ
    return "350px"; // Desktop
  };

  return (
    <Row>
      <Swiper
        style={{
          "--swiper-navigation-size": windowWidth <= 768 ? "20px" : "30px", // Giảm kích thước nút điều hướng trên mobile/tablet
          "--swiper-navigation-color": "#52c41a",
          marginBottom: "10px",
        }}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
        }}
        loop={true}
        spaceBetween={10}
        modules={[FreeMode, Navigation, Thumbs, Autoplay]}
        navigation
        className="mySwiper2"
      >
        <SwiperSlide>
          <img
            src={banner1}
            alt="Slide 1"
            style={{
              width: "100%",
              height: getBannerHeight(),
              objectFit: "cover", // Giữ tỷ lệ ảnh
            }}
            onContextMenu={(e) => e.preventDefault()}
            draggable="false"
          />
        </SwiperSlide>
        <SwiperSlide>
          <img
            src={banner2}
            alt="Slide 2"
            style={{
              width: "100%",
              height: getBannerHeight(),
              objectFit: "cover",
            }}
            onContextMenu={(e) => e.preventDefault()}
            draggable="false"
          />
        </SwiperSlide>
        <SwiperSlide>
          <img
            src={banner3}
            alt="Slide 3"
            style={{
              width: "100%",
              height: getBannerHeight(),
              objectFit: "cover",
            }}
            onContextMenu={(e) => e.preventDefault()}
            draggable="false"
          />
        </SwiperSlide>
      </Swiper>
    </Row>
  );
};

export default BannerHome;
