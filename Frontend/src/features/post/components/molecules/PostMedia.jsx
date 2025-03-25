import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import "swiper/css/thumbs";
import { FreeMode, Navigation, Thumbs } from "swiper/modules";
import { Row } from "antd";
import { useState } from "react";

const PostMedia = ({ mediaData }) => {
  const [thumbsSwiper, setThumbsSwiper] = useState(null);

  // Hàm render media (ảnh hoặc video)
  const renderMedia = (item, index, isThumbnail = false) => {
    const style = isThumbnail
      ? { maxHeight: "100px", width: "100%", objectFit: "cover" }
      : { maxHeight: "600px", width: "100%", objectFit: "cover" };

    if (item.type === "image") {
      return (
        <img
          src={item.url}
          alt={`Media ${index}`}
          style={style}
          onContextMenu={(e) => e.preventDefault()}
          draggable="false"
        />
      );
    } else if (item.type === "video") {
      return (
        <video
          src={item.url}
          controls={!isThumbnail} // Chỉ hiển thị controls trong Swiper chính
          muted={isThumbnail} // Tắt tiếng trong thumbnail
          style={style}
          onContextMenu={(e) => e.preventDefault()}
          draggable="false"
        />
      );
    }
    return null;
  };

  return (
    <Row>
      {mediaData?.length > 0 && (
        <>
          {/* Swiper chính để hiển thị media */}
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
            {mediaData?.map((item, index) => (
              <SwiperSlide key={index}>{renderMedia(item, index)}</SwiperSlide>
            ))}
          </Swiper>

          {/* Swiper thumbnail (nếu có nhiều hơn 1 media) */}
          {mediaData?.length > 1 && (
            <Swiper
              onSwiper={setThumbsSwiper}
              spaceBetween={10}
              slidesPerView={mediaData.length > 5 ? 5 : mediaData.length}
              freeMode={true}
              watchSlidesProgress={true}
              modules={[FreeMode, Navigation, Thumbs]}
              className="mySwiper"
            >
              {mediaData?.map((item, index) => (
                <SwiperSlide key={index}>
                  {renderMedia(item, index, true)}
                </SwiperSlide>
              ))}
            </Swiper>
          )}
        </>
      )}
    </Row>
  );
};

export default PostMedia;
