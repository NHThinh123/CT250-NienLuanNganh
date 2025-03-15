import { useState } from "react";
import BusinessFilter from "../organisms/BusinessFilter";
import Businesses from "./Businesses";

const BusinessList = ({ businessData }) => {
  const [searchKeyword, setSearchKeyword] = useState("");
  console.log("businessData in businessList", businessData);
  const handleSearch = (keyword) => {
    setSearchKeyword(keyword);
  };

  return (
    <>
      <BusinessFilter handleSearch={handleSearch} />
      <Businesses businessData={businessData} searchKeyword={searchKeyword} />
    </>
  );
};

export default BusinessList;
