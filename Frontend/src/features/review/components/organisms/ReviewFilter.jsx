import { Button, Space } from "antd";
import { useState } from "react";
import "../../../../styles/global.css";

const ReviewFilter = ({ onFilterChange }) => {
  const [selectedFilters, setSelectedFilters] = useState([]); // Không chọn mặc định

  const filterOptions = [
    { label: "Mới nhất", value: "latest" },
    { label: "Cũ nhất", value: "oldest" },
    { label: "Có hình ảnh/video", value: "hasMedia" },
    { label: "Có bình luận", value: "hasComment" },
    { label: "5 sao", value: "5" },
    { label: "4 sao", value: "4" },
    { label: "3 sao", value: "3" },
    { label: "2 sao", value: "2" },
    { label: "1 sao", value: "1" },
  ];

  const handleFilterClick = (value) => {
    let newFilters = [...selectedFilters];

    if (value === "latest" || value === "oldest") {
      // Nếu chọn "Mới nhất" hoặc "Cũ nhất"
      if (newFilters.includes(value)) {
        newFilters = newFilters.filter((f) => f !== value);
      } else {
        newFilters = newFilters.filter((f) => f !== "latest" && f !== "oldest");
        newFilters.push(value);
      }
    } else {
      // Toggle các bộ lọc khác (bao gồm hasMedia và hasComment)
      if (newFilters.includes(value)) {
        newFilters = newFilters.filter((f) => f !== value);
      } else {
        newFilters.push(value);
      }
    }

    setSelectedFilters(newFilters);
    if (onFilterChange) {
      onFilterChange(newFilters); // Gọi callback để truyền các giá trị lọc lên component cha
    }
  };

  return (
    <div style={{ marginBottom: 10 }}>
      <p style={{ marginBottom: 10, fontWeight: "bold", fontSize: 14 }}>
        Lọc theo
      </p>
      <Space wrap>
        {filterOptions.map((option) => (
          <Button
            key={option.value}
            type={
              selectedFilters.includes(option.value) ? "primary" : "default"
            }
            onClick={() => handleFilterClick(option.value)}
          >
            {option.label}
          </Button>
        ))}
      </Space>
    </div>
  );
};

export default ReviewFilter;
