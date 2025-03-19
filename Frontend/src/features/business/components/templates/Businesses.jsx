import { useState } from "react";
import BusinessFilter from "../organisms/BusinessFilter";
import BusinessList from "./BusinessList";

const Businesses = ({ businessData }) => {
  const [searchKeyword, setSearchKeyword] = useState("");
  const [typeSortOption, setTypeSortOption] = useState("");
  const [sortOption, setSortOption] = useState("high_to_low");
  const [starFilters, setStarFilters] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 100000000000]);
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredTotalItems, setFilteredTotalItems] = useState(0);
  const ITEMS_PER_PAGE = 8;

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

  return (
    <>
      <div style={{ position: "sticky", top: 63.8, zIndex: 1000 }}>
        <BusinessFilter
          handleSearch={handleSearch}
          handleSortChange={handleSortChange}
          handleTypeSort={handleTypeSort}
          handleStarFilter={handleStarFilter}
          onPageChange={handlePageChange}
          handlePriceRangeChange={handlePriceRangeChange}
          businessData={businessData}
          totalItems={filteredTotalItems}
          itemsPerPage={ITEMS_PER_PAGE}
        />
      </div>
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
      />
    </>
  );
};

export default Businesses;
