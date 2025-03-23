// ReviewFilter.jsx
// import { Button, Space } from "antd";
// import { useState } from "react";
// import "../../../../styles/global.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar as solidStar } from "@fortawesome/free-solid-svg-icons";
import useBussinessById from "../../../business/hooks/useBusinessById";
import Rating from "react-rating";
import { Progress } from "antd";

const ReviewOverview = ({ businessId }) => {
  const { businessData } = useBussinessById(businessId);
  console.log("businessDetail: ", businessData);

  return (
    <div style={{ marginBottom: 16 }}>
      {businessData.rating_average}
      <p>
        <Rating
          initialRating={businessData.rating_average}
          readonly
          emptySymbol={
            <FontAwesomeIcon
              icon={solidStar}
              style={{ fontSize: 20, color: "#E0E0E0" }}
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
      </p>{" "}
      ({businessData.totalReviews} đánh giá)
      <div style={{ display: "flex" }}>
        <Rating
          initialRating={1}
          readonly
          emptySymbol={
            <FontAwesomeIcon
              icon={solidStar}
              style={{ fontSize: 14, color: "#E0E0E0" }}
            />
          }
          fullSymbol={
            <FontAwesomeIcon
              icon={solidStar}
              style={{ fontSize: 14, color: "#FFD700" }}
            />
          }
          fractions={10}
          quiet={true}
        />
        <Progress percent={30} size={"small"} style={{ width: "40%" }} />
      </div>
      <div style={{ borderTop: "1px solid #ddd", marginTop: 10 }}></div>
    </div>
  );
};

export default ReviewOverview;
