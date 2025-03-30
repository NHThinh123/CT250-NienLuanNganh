import { useEffect, useState } from "react";
import BoxContainer from "../../../../components/atoms/BoxContainer";
import { Input, Row, Col, Select, Button, Checkbox, Slider } from "antd";
import { ArrowRight, SlidersHorizontal } from "lucide-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar as solidStar } from "@fortawesome/free-solid-svg-icons";

const { Option } = Select;

const BusinessFilter = ({
  handleSearch,
  handleSortChange,
  handleTypeSort,
  handleStarFilter,
  businessData,
  handlePriceRangeChange,
}) => {
  const [searchValue, setSearchValue] = useState("");
  const [selectedStars, setSelectedStars] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 100]);
  const [selectedPriceRange, setSelectedPriceRange] = useState([0, 100]);

  useEffect(() => {
    if (businessData.length > 0) {
      const minPrice = Math.min(...businessData.map((b) => b.dish_lowest_cost));
      const maxPrice = Math.max(
        ...businessData.map((b) => b.dish_highest_cost)
      );
      setPriceRange([minPrice, maxPrice]);
      setSelectedPriceRange([minPrice, maxPrice]);
    }
  }, [businessData]);

  const handlePriceChange = (value) => {
    setSelectedPriceRange(value);
    handlePriceRangeChange(value);
  };

  const formatPrice = (price) => {
    if (typeof price !== "number" || isNaN(price)) return "N/A";
    return price.toLocaleString("vi-VN");
  };

  const handleInputChange = (e) => setSearchValue(e.target.value);
  const handleSearchClick = () => handleSearch(searchValue);
  const handleStarChange = (checkedValues) => {
    setSelectedStars(checkedValues);
    handleStarFilter(checkedValues);
  };
  const toggleFilters = () => setShowFilters(!showFilters);

  return (
    <BoxContainer>
      <Row gutter={[8, 16]} align="middle">
        {/* Input Search */}
        <Col xs={24} sm={24} md={9} lg={12}>
          <Input.Search
            placeholder="Tìm kiếm quán ăn"
            value={searchValue}
            onChange={handleInputChange}
            onSearch={handleSearchClick}
            enterButton
            style={{ width: "100%" }}
          />
        </Col>

        {/* Sort Type */}
        <Col xs={24} sm={12} md={6} lg={4}>
          <Select
            defaultValue="Sắp xếp"
            style={{ width: "100%" }}
            onChange={handleTypeSort}
          >
            <Option value="cost">Giá</Option>
            <Option value="star">Sao</Option>
            <Option value="reviews">Lượt đánh giá</Option>
          </Select>
        </Col>

        {/* Sort Order */}
        <Col xs={24} sm={12} md={5} lg={4}>
          <Select
            defaultValue="high_to_low"
            onChange={handleSortChange}
            style={{ width: "100%" }}
          >
            <Option value="high_to_low">
              <div style={{ display: "flex", alignItems: "center" }}>
                Cao <ArrowRight size={16} style={{ margin: "0 3px" }} /> Thấp
              </div>
            </Option>
            <Option value="low_to_high">
              <div style={{ display: "flex", alignItems: "center" }}>
                Thấp <ArrowRight size={16} style={{ margin: "0 3px" }} /> Cao
              </div>
            </Option>
          </Select>
        </Col>

        {/* Filter Toggle Button */}
        <Col xs={24} sm={24} md={4} lg={4}>
          <Button onClick={toggleFilters} block>
            <SlidersHorizontal size={15} /> {showFilters ? "Ẩn" : "Bộ lọc"}
          </Button>
        </Col>
      </Row>

      {/* Filters Section */}
      {showFilters && (
        <div style={{ marginTop: 16 }}>
          {/* Star Filter */}
          <Row gutter={[8, 8]} align="middle">
            <Col xs={24} sm={4} md={3} style={{ fontWeight: "bold" }}>
              Sao:
            </Col>
            <Col xs={24} sm={20} md={21}>
              <Checkbox.Group
                onChange={handleStarChange}
                value={selectedStars}
                style={{ display: "flex", flexWrap: "wrap", gap: 10 }}
              >
                {[
                  "0_to_1_star",
                  "1_to_2_star",
                  "2_to_3_star",
                  "3_to_4_star",
                  "4_to_5_star",
                ].map((range, idx) => (
                  <Checkbox key={range} value={range}>
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <span style={{ margin: "0 5px" }}>{idx}</span> -
                      <span style={{ margin: "0 5px" }}>{idx + 1}</span>
                      <FontAwesomeIcon
                        icon={solidStar}
                        style={{ fontSize: 13, color: "#FFD700" }}
                      />
                    </div>
                  </Checkbox>
                ))}
              </Checkbox.Group>
            </Col>
          </Row>

          {/* Price Filter */}
          <Row gutter={[8, 8]} align="middle" style={{ marginTop: 16 }}>
            <Col xs={24} sm={4} md={3} style={{ fontWeight: "bold" }}>
              Giá:
            </Col>
            <Col xs={14} sm={14} md={15}>
              <Slider
                range={{ draggableTrack: true }}
                defaultValue={priceRange}
                min={priceRange[0]}
                max={priceRange[1]}
                step={1000}
                tooltip={{ formatter: (value) => formatPrice(value) }}
                onChange={handlePriceChange}
              />
            </Col>
            <Col
              xs={10}
              sm={6}
              md={6}
              style={{
                textAlign: "center",
                display: "flex",
                alignItems: "center",
              }}
            >
              {formatPrice(selectedPriceRange[0])}đ{" "}
              <ArrowRight size={15} style={{ margin: "0 5px" }} />{" "}
              {formatPrice(selectedPriceRange[1])}đ
            </Col>
          </Row>
        </div>
      )}
    </BoxContainer>
  );
};

export default BusinessFilter;
