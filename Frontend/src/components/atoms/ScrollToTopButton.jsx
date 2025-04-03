// src/components/atoms/ScrollToTop.jsx
import { useState, useEffect } from "react";
import { Button } from "antd";
import { UpOutlined } from "@ant-design/icons";

const ScrollToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  // Hiển thị nút khi scroll xuống 300px
  const toggleVisibility = () => {
    if (window.pageYOffset > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  // Scroll lên đầu trang
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    window.addEventListener("scroll", toggleVisibility);
    return () => {
      window.removeEventListener("scroll", toggleVisibility);
    };
  }, []);

  return (
    <>
      {isVisible && (
        <Button
          type="primary"
          shape="circle"
          icon={<UpOutlined />}
          size="large"
          onClick={scrollToTop}
          style={{
            position: "fixed",
            bottom: "80px",
            right: "85px",
            zIndex: 1000,
          }}
        />
      )}
    </>
  );
};

export default ScrollToTopButton;
