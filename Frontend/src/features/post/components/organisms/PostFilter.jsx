import { useState } from "react";
import BoxContainer from "../../../../components/atoms/BoxContainer";
import { Select, Input } from "antd";

const { Option } = Select;

const PostFilter = ({ handleSearch, handleSortChange }) => {
  const [searchValue, setSearchValue] = useState("");

  const handleInputChange = (e) => {
    setSearchValue(e.target.value);
  };

  const handleSearchClick = () => {
    handleSearch(searchValue);
  };

  return (
    <BoxContainer style={{ display: "flex", gap: 10 }}>
      <Input.Search
        placeholder="Tìm kiếm bài viết"
        value={searchValue}
        onChange={handleInputChange}
        onSearch={handleSearchClick}
        enterButton
      />
      <Select
        defaultValue="most_likes"
        style={{ width: 150 }}
        onChange={handleSortChange}
      >
        <Option value="newest">Mới nhất</Option>
        <Option value="oldest">Cũ nhất</Option>
        <Option value="most_likes">Phù hợp nhất</Option>
        <Option value="most_comments">Nhiều bình luận</Option>
      </Select>
    </BoxContainer>
  );
};

export default PostFilter;
