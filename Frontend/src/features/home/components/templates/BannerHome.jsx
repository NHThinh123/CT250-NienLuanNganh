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
const BannerHome = () => {
  return (
    <Row>
      <Swiper
        style={{
          "--swiper-navigation-size": "30px",
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
            alt={`Slide 1`}
            style={{ width: "100%", height: "350px" }}
            onContextMenu={(e) => e.preventDefault()}
            draggable="false"
          />
        </SwiperSlide>
        <SwiperSlide>
          <img
            src={banner2}
            alt={`Slide 2`}
            style={{ width: "100%", height: "350px" }}
            onContextMenu={(e) => e.preventDefault()}
            draggable="false"
          />
        </SwiperSlide>
        <SwiperSlide>
          <img
            src={banner3}
            alt={`Slide 3`}
            style={{ width: "100%", height: "350px" }}
            onContextMenu={(e) => e.preventDefault()}
            draggable="false"
          />
        </SwiperSlide>
      </Swiper>
    </Row>
  );
};

export default BannerHome;
