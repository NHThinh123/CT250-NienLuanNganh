import { useState } from "react";
import BusinessFilter from "../organisms/BusinessFilter";
import BusinessList from "./BusinessList";

const Businesses = ({ businessData }) => {
  const [searchKeyword, setSearchKeyword] = useState("");
  const [sortOption, setSortOption] = useState("");
  const [starFilters, setStarFilters] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredTotalItems, setFilteredTotalItems] = useState(0);
  const ITEMS_PER_PAGE = 8;

  const handleSearch = (keyword) => {
    setSearchKeyword(keyword);
  };

  const handleSortChange = (option) => {
    setSortOption(option);
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
          handleStarFilter={handleStarFilter}
          onPageChange={handlePageChange}
          totalItems={filteredTotalItems}
          itemsPerPage={ITEMS_PER_PAGE}
        />
      </div>
      <BusinessList
        businessData={businessData}
        searchKeyword={searchKeyword}
        sortOption={sortOption}
        starFilters={starFilters}
        currentPage={currentPage}
        itemsPerPage={ITEMS_PER_PAGE}
        setFilteredTotalItems={setFilteredTotalItems}
      />
    </>
  );
};

export default Businesses;
