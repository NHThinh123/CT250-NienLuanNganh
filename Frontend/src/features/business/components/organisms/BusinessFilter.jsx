import { useEffect, useState } from "react";
import BoxContainer from "../../../../components/atoms/BoxContainer";
import { Input, Row, Col, Select, Button, Checkbox, Slider } from "antd";
import { ArrowRight, SlidersHorizontal } from "lucide-react";
import BusinessPagination from "../molecules/BusinessPagination";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar as solidStar } from "@fortawesome/free-solid-svg-icons";

const { Option } = Select;

const BusinessFilter = ({
  handleSearch,
  handleSortChange,
  handleTypeSort,
  handleStarFilter,
  onPageChange,
  totalItems,
  itemsPerPage,
  businessData,
  handlePriceRangeChange,
}) => {
  const [searchValue, setSearchValue] = useState("");
  const [selectedStars, setSelectedStars] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 100]); // Giá trị mặc định
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
  }, [businessData]); // Chạy lại khi businesses thay đổi

  const handlePriceChange = (value) => {
    setSelectedPriceRange(value);
    handlePriceRangeChange(value);
  };

  const formatPrice = (price) => {
    if (typeof price !== "number" || isNaN(price)) {
      return "N/A";
    }
    return price.toLocaleString("vi-VN");
  };

  const handleInputChange = (e) => {
    setSearchValue(e.target.value);
  };

  const handleSearchClick = () => {
    handleSearch(searchValue);
  };

  const handleStarChange = (checkedValues) => {
    setSelectedStars(checkedValues);
    handleStarFilter(checkedValues); // Gửi danh sách rating được chọn lên Businesses
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  return (
    <BoxContainer>
      <Row>
        <Col span={11}>
          <Input.Search
            placeholder="Tìm kiếm quán ăn"
            value={searchValue}
            onChange={handleInputChange}
            onSearch={handleSearchClick}
            enterButton
            style={{ paddingRight: "22px" }}
          />
        </Col>
        <Col span={3}>
          <Select
            defaultValue="Sắp xếp"
            style={{ width: "100%", textAlign: "center" }}
            onChange={handleTypeSort}
          >
            <Option value="cost">Giá</Option>
            <Option value="star">Sao</Option>
            <Option value="reviews">Lượt đánh giá</Option>
          </Select>
        </Col>
        <Col span={3} style={{ paddingLeft: "4px" }}>
          <Select
            defaultValue="high_to_low"
            onChange={handleSortChange}
            style={{ width: "100%" }}
          >
            <Option value="high_to_low">
              <div style={{ display: "flex", alignItems: "center" }}>
                Cao{" "}
                <ArrowRight
                  size={16}
                  strokeWidth={1.75}
                  style={{ margin: "0px 3px" }}
                />{" "}
                Thấp
              </div>
            </Option>
            <Option value="low_to_high">
              <div style={{ display: "flex", alignItems: "center" }}>
                Thấp{" "}
                <ArrowRight
                  size={16}
                  strokeWidth={1.75}
                  style={{ margin: "0px 3px" }}
                />{" "}
                Cao
              </div>
            </Option>
          </Select>
        </Col>
        <Col span={3} style={{ paddingLeft: "22px" }}>
          <Button onClick={toggleFilters} block>
            <SlidersHorizontal size={15} />
            {showFilters ? "Ẩn bộ lọc" : "Bộ lọc"}
          </Button>
        </Col>
        <Col
          span={4}
          style={{ display: "grid", width: "100%", placeContent: "center" }}
        >
          <BusinessPagination
            totalItems={totalItems}
            itemsPerPage={itemsPerPage}
            onPageChange={onPageChange}
          />
        </Col>
      </Row>
      {showFilters && (
        <div>
          <Row style={{ marginTop: 10 }}>
            <Col span={1}></Col>
            <Col
              span={2}
              style={{ placeContent: "center", fontWeight: "bold" }}
            >
              Sao:
            </Col>
            <Col span={21}>
              <Checkbox.Group
                onChange={handleStarChange}
                value={selectedStars}
                style={{ gap: 30 }}
              >
                <Checkbox value="0_to_1_star">
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <span style={{ margin: 5 }}>0</span> -
                    <span style={{ margin: 5 }}>1</span>
                    <span>
                      <FontAwesomeIcon
                        icon={solidStar}
                        style={{ fontSize: 13, color: "#FFD700" }}
                      />
                    </span>
                  </div>
                </Checkbox>
                <Checkbox value="1_to_2_star">
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <span style={{ margin: 5 }}>1</span> -
                    <span style={{ margin: 5 }}>2</span>
                    <span>
                      <FontAwesomeIcon
                        icon={solidStar}
                        style={{ fontSize: 13, color: "#FFD700" }}
                      />
                    </span>
                  </div>
                </Checkbox>
                <Checkbox value="2_to_3_star">
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <span style={{ margin: 5 }}>2</span> -
                    <span style={{ margin: 5 }}>3</span>
                    <span>
                      <FontAwesomeIcon
                        icon={solidStar}
                        style={{ fontSize: 13, color: "#FFD700" }}
                      />
                    </span>
                  </div>
                </Checkbox>
                <Checkbox value="3_to_4_star">
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <span style={{ margin: 5 }}>3</span> -
                    <span style={{ margin: 5 }}>4</span>
                    <span>
                      <FontAwesomeIcon
                        icon={solidStar}
                        style={{ fontSize: 13, color: "#FFD700" }}
                      />
                    </span>
                  </div>
                </Checkbox>
                <Checkbox value="4_to_5_star">
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <span style={{ margin: 5 }}>4</span> -
                    <span style={{ margin: 5 }}>5</span>
                    <span>
                      <FontAwesomeIcon
                        icon={solidStar}
                        style={{ fontSize: 13, color: "#FFD700" }}
                      />
                    </span>
                  </div>
                </Checkbox>
              </Checkbox.Group>
            </Col>
          </Row>
          <Row>
            <Col span={1}></Col>
            <Col
              span={2}
              style={{ placeContent: "center", fontWeight: "bold" }}
            >
              Giá:
            </Col>
            <Col span={14}>
              <Slider
                range={{ draggableTrack: true }}
                defaultValue={priceRange}
                min={priceRange[0]}
                max={priceRange[1]}
                step={1000}
                tooltip={{
                  formatter: (value) => formatPrice(value), // Định dạng giá hiển thị khi trượt
                }}
                onChange={handlePriceChange}
              />
            </Col>
            <Col
              span={4}
              style={{ display: "flex", alignItems: "center", marginLeft: 15 }}
            >
              {formatPrice(selectedPriceRange[0])}đ{" "}
              <ArrowRight
                size={15}
                strokeWidth={1.75}
                style={{ margin: "0px 10px" }}
              />{" "}
              {formatPrice(selectedPriceRange[1])}đ
            </Col>
          </Row>
        </div>
      )}
    </BoxContainer>
  );
};

export default BusinessFilter;
