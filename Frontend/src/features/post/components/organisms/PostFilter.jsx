import BoxContainer from "../../../../components/atoms/BoxContainer";
import { Select } from "antd";
import Search from "antd/es/input/Search";
import { Option } from "antd/es/mentions";

const PostFilter = ({ handleSearch, handleSortChange }) => {
  return (
    <BoxContainer style={{ marginBottom: 16, display: "flex", gap: 10 }}>
      <Search
        placeholder="Tìm kiếm bài viết"
        onSearch={handleSearch}
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
