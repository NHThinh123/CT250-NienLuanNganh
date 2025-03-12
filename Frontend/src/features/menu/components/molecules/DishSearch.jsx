import { useState } from "react";
import BoxContainer from "../../../../components/atoms/BoxContainer";
import { Input } from "antd";

const DishSearch = ({ onSearch }) => {
  const [searchValue, setSearchValue] = useState("");

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchValue(value);
    onSearch(value); // Gọi hàm onSearch ngay khi người dùng nhập
  };

  // const handleClearSearch = () => {
  //   setSearchValue("");
  //   onSearch(""); // Gọi hàm onSearch với giá trị rỗng để xóa kết quả tìm kiếm
  // };

  return (
    <BoxContainer>
      <Input.Search
        placeholder="Tìm kiếm món"
        value={searchValue}
        onChange={handleInputChange}
        enterButton
        // suffix={
        //   searchValue ? (
        //     <CloseCircleOutlined onClick={handleClearSearch} />
        //   ) : null
        // }
      />
    </BoxContainer>
  );
};

export default DishSearch;
