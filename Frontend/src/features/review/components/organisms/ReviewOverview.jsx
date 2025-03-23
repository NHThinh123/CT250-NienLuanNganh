import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar as solidStar } from "@fortawesome/free-solid-svg-icons";
import useBussinessById from "../../../business/hooks/useBusinessById";
import useReviewByBusinessId from "../../hooks/useReviewByBusinessId";
import Rating from "react-rating";
import { Progress } from "antd";

const ReviewOverview = ({ businessId }) => {
  const { reviewData } = useReviewByBusinessId(businessId);
  console.log("reviewData: ", reviewData);
  const { businessData } = useBussinessById(businessId);

  // Tạo mảng rating từ 5 đến 1
  const ratingLevels = [5, 4, 3, 2, 1];

  // Tính số lượng review cho từng mức rating
  const ratingCounts = ratingLevels.reduce((acc, rating) => {
    const count =
      reviewData?.filter(
        (review) => Math.round(review.review_rating) === rating
      ).length || 0;
    acc[rating] = count;
    return acc;
  }, {});

  // Tính phần trăm cho từng mức rating
  const totalReviews = businessData.totalReviews || 0;
  const ratingPercentages = ratingLevels.reduce((acc, rating) => {
    acc[rating] =
      totalReviews > 0 ? (ratingCounts[rating] / totalReviews) * 100 : 0;
    return acc;
  }, {});

  return (
    <div style={{ marginBottom: 16 }}>
      <p style={{ fontWeight: "bold", margin: 0, fontSize: 14 }}>
        Tổng quan đánh giá
      </p>
      <div style={{ display: "flex", alignItems: "center" }}>
        <div
          style={{
            fontSize: 28,
            fontWeight: "bold",
            marginRight: 8,
          }}
        >
          {businessData.rating_average}
        </div>
        <Rating
          initialRating={businessData.rating_average}
          readonly
          emptySymbol={
            <FontAwesomeIcon
              icon={solidStar}
              style={{ fontSize: 18, color: "#E0E0E0" }}
            />
          }
          fullSymbol={
            <FontAwesomeIcon
              icon={solidStar}
              style={{ fontSize: 18, color: "#FFD700" }}
            />
          }
          fractions={10}
          quiet={true}
        />
      </div>
      ({businessData.totalReviews} đánh giá)
      {ratingLevels.map((rating) => (
        <div key={rating} style={{ display: "flex" }}>
          <Rating
            initialRating={rating}
            readonly
            emptySymbol={
              <FontAwesomeIcon
                icon={solidStar}
                style={{ fontSize: 12, color: "#E0E0E0" }}
              />
            }
            fullSymbol={
              <FontAwesomeIcon
                icon={solidStar}
                style={{ fontSize: 12, color: "#FFD700" }}
              />
            }
            fractions={10}
            quiet={true}
          />
          <Progress
            percent={ratingPercentages[rating]} // Sử dụng phần trăm tính được
            size={"small"}
            style={{ width: "60%", marginLeft: 4, fontSize: 13 }}
            format={() => `${ratingCounts[rating]}`} // Hiển thị số lượng đánh giá
          />
        </div>
      ))}
      {/* <div style={{ borderTop: "1px solid #ddd", marginTop: 10 }}></div> */}
    </div>
  );
};

export default ReviewOverview;
