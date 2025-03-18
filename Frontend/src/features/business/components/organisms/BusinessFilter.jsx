import { useState } from "react";
import BoxContainer from "../../../../components/atoms/BoxContainer";
import { Input, Row, Col, Select, Button, Checkbox } from "antd";
import { SlidersHorizontal } from "lucide-react";
import BusinessPagination from "../molecules/BusinessPagination";

const { Option } = Select;

const BusinessFilter = ({
  handleSearch,
  handleSortChange,
  handleStarFilter,
  onPageChange,
  totalItems,
  itemsPerPage,
}) => {
  const [searchValue, setSearchValue] = useState("");
  const [selectedStars, setSelectedStars] = useState([]);
  const [showFilters, setShowFilters] = useState(false);

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
        <Col span={12}>
          <Input.Search
            placeholder="Tìm kiếm quán ăn"
            value={searchValue}
            onChange={handleInputChange}
            onSearch={handleSearchClick}
            enterButton
            style={{ paddingRight: "10px" }}
          />
        </Col>
        <Col span={5}>
          <Select
            defaultValue="Sắp xếp theo..."
            style={{ width: "100%", textAlign: "center" }}
            onChange={handleSortChange}
          >
            <Option value="high_to_low_reviews">
              Lượt đánh giá nhiều đến ít
            </Option>
            <Option value="low_to_high_cost">Giá thấp đến cao</Option>
            <Option value="high_to_low_cost">Giá cao đến thấp</Option>
          </Select>
        </Col>
        <Col span={3} style={{ paddingLeft: "8px" }}>
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
        <Row style={{ marginTop: "16px" }}>
          <Col span={2}>Đánh giá:</Col>
          <Col span={22}>
            <Checkbox.Group onChange={handleStarChange} value={selectedStars}>
              <Checkbox value="from_3_stars">từ 3 sao</Checkbox>
              <Checkbox value="from_4_stars">từ 4 sao</Checkbox>
              <Checkbox value="from_5_stars">từ 5 sao</Checkbox>
            </Checkbox.Group>
          </Col>
        </Row>
      )}
    </BoxContainer>
  );
};

export default BusinessFilter;
