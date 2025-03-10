import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import "swiper/css/thumbs";
import { FreeMode, Navigation, Thumbs } from "swiper/modules";
import { Row } from "antd";
import { useState } from "react";

const PostImages = ({ imagesData }) => {
  const [thumbsSwiper, setThumbsSwiper] = useState(null);

  return (
    <Row>
      {imagesData?.length > 0 && (
        <>
          <Swiper
            style={{
              "--swiper-navigation-size": "30px",
              "--swiper-navigation-color": "#52c41a",
              marginBottom: "10px",
            }}
            spaceBetween={10}
            thumbs={{ swiper: thumbsSwiper }}
            modules={[FreeMode, Navigation, Thumbs]}
            navigation
            className="mySwiper2"
          >
            {imagesData?.map((image, index) => (
              <SwiperSlide
                key={index}
                style={{ maxHeight: "500px", overflow: "cover" }}
              >
                <img
                  src={image?.url}
                  alt={`Slide ${index}`}
                  style={{ width: "100%" }}
                  onContextMenu={(e) => e.preventDefault()}
                  draggable="false"
                />
              </SwiperSlide>
            ))}
          </Swiper>
          {imagesData?.length > 1 && (
            <Swiper
              onSwiper={setThumbsSwiper}
              spaceBetween={10}
              slidesPerView={imagesData?.length > 5 ? 5 : imagesData?.length}
              freeMode={true}
              watchSlidesProgress={true}
              modules={[FreeMode, Navigation, Thumbs]}
              className="mySwiper"
            >
              {imagesData?.map((image, index) => (
                <SwiperSlide key={index} style={{ maxHeight: "100px" }}>
                  <img src={image?.url} alt={`Slide ${index}`} />
                </SwiperSlide>
              ))}
            </Swiper>
          )}
        </>
      )}
    </Row>
  );
};

export default PostImages;
