import { useState, useEffect } from "react";
import { Button, Drawer } from "antd";
import { FilterOutlined } from "@ant-design/icons";
import BusinessFilter from "../organisms/BusinessFilter";
import BusinessList from "./BusinessList";

const Businesses = ({ businessData }) => {
  const [searchKeyword, setSearchKeyword] = useState("");
  const [typeSortOption, setTypeSortOption] = useState("");
  const [sortOption, setSortOption] = useState("high_to_low");
  const [starFilters, setStarFilters] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 100000000000]);
  const [currentPage, setCurrentPage] = useState(1);
  const [, setFilteredTotalItems] = useState(0);
  const [visible, setVisible] = useState(false); // Trạng thái hiển thị Drawer
  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth < 768); // Kiểm tra kích thước màn hình
  const ITEMS_PER_PAGE = 8;

  // Theo dõi thay đổi kích thước màn hình
  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleSearch = (keyword) => {
    setSearchKeyword(keyword);
  };

  const handleTypeSort = (option) => {
    setTypeSortOption(option);
  };

  const handleSortChange = (option) => {
    setSortOption(option);
  };

  const handlePriceRangeChange = (range) => {
    setPriceRange(range);
  };

  const handleStarFilter = (stars) => {
    setStarFilters(stars);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const showDrawer = () => {
    setVisible(true);
  };

  const onClose = () => {
    setVisible(false);
  };

  return (
    <>
      {/* Hiển thị BusinessFilter trực tiếp trên màn hình lớn */}
      {!isSmallScreen && (
        <div style={{ position: "sticky", top: 63.8, zIndex: 1000 }}>
          <BusinessFilter
            handleSearch={handleSearch}
            handleSortChange={handleSortChange}
            handleTypeSort={handleTypeSort}
            handleStarFilter={handleStarFilter}
            handlePriceRangeChange={handlePriceRangeChange}
            businessData={businessData}
          />
        </div>
      )}

      {/* Nút thả nổi chỉ hiển thị trên xs và sm */}
      {isSmallScreen && !visible && (
        <Button
          type="primary"
          shape="circle"
          icon={<FilterOutlined />}
          size="large"
          onClick={showDrawer}
          style={{
            position: "fixed",
            top: "20px",
            left: "20px",
            zIndex: 10010,
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
          }}
        />
      )}

      {/* Drawer chỉ hiển thị trên xs và sm */}
      {isSmallScreen && (
        <Drawer
          title="Tìm kiếm và bộ lọc"
          placement="left"
          onClose={onClose}
          open={visible}
          width="60%" // Chiều rộng phù hợp với màn hình nhỏ
          styles={{ body: { padding: 0 } }}
        >
          <BusinessFilter
            handleSearch={handleSearch}
            handleSortChange={handleSortChange}
            handleTypeSort={handleTypeSort}
            handleStarFilter={handleStarFilter}
            handlePriceRangeChange={handlePriceRangeChange}
            businessData={businessData}
          />
        </Drawer>
      )}

      {/* BusinessList luôn hiển thị */}
      <BusinessList
        businessData={businessData}
        searchKeyword={searchKeyword}
        typeSortOption={typeSortOption}
        sortOption={sortOption}
        starFilters={starFilters}
        priceRange={priceRange}
        currentPage={currentPage}
        itemsPerPage={ITEMS_PER_PAGE}
        setFilteredTotalItems={setFilteredTotalItems}
        onPageChange={handlePageChange}
      />
    </>
  );
};

export default Businesses;
