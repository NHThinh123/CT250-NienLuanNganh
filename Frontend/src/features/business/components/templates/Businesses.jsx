import { useState } from "react";
import BusinessFilter from "../organisms/BusinessFilter";
import BusinessList from "./BusinessList";

const Businesses = ({ businessData }) => {
  const [searchKeyword, setSearchKeyword] = useState("");
  const [sortOption, setSortOption] = useState("");
  const [starFilters, setStarFilters] = useState([]);

  const handleSearch = (keyword) => {
    setSearchKeyword(keyword);
  };

  const handleSortChange = (option) => {
    setSortOption(option);
  };

  const handleStarFilter = (stars) => {
    setStarFilters(stars);
  };

  return (
    <>
      <BusinessFilter
        handleSearch={handleSearch}
        handleSortChange={handleSortChange}
        handleStarFilter={handleStarFilter}
      />
      <BusinessList
        businessData={businessData}
        searchKeyword={searchKeyword}
        sortOption={sortOption}
        starFilters={starFilters}
      />
    </>
  );
};

export default Businesses;
