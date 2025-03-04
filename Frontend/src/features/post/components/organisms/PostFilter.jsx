import { useState } from "react";
import BoxContainer from "../../../../components/atoms/BoxContainer";
import { Select, Input, Checkbox, Row, Col, Button } from "antd";
import { SlidersHorizontal } from "lucide-react";

const { Option } = Select;
const tagOptions = [
  "Món ngon",
  "Quán xịn",
  "Du lịch",
  "Phục vụ tốt",
  "Góp ý",
  "An toàn",
  "Chất lượng",
  "Trending",
  "Bình dân",
  "Sinh viên",
  "Gia đình",
  "Sang trọng",
].map((tag) => ({ value: tag, label: tag }));

const PostFilter = ({ handleSearch, handleSortChange, handleTagFilter }) => {
  const [searchValue, setSearchValue] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);
  const [showFilters, setShowFilters] = useState(false);

  const handleInputChange = (e) => {
    setSearchValue(e.target.value);
  };

  const handleSearchClick = () => {
    handleSearch(searchValue);
  };

  const handleTagChange = (checkedValues) => {
    setSelectedTags(checkedValues);
    handleTagFilter(checkedValues);
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  return (
    <BoxContainer>
      <Row justify={"center"} style={{ textAlign: "center" }}>
        <Col span={16}>
          <Input.Search
            placeholder="Tìm kiếm bài viết"
            value={searchValue}
            onChange={handleInputChange}
            onSearch={handleSearchClick}
            enterButton
            style={{ paddingRight: "10px" }}
          />
        </Col>
        <Col span={4}>
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
        </Col>
        <Col span={4} style={{ paddingLeft: "8px" }}>
          <Button onClick={toggleFilters} block>
            <SlidersHorizontal size={15} />
            {showFilters ? "Ẩn bộ lọc" : "Bộ lọc"}
          </Button>
        </Col>
      </Row>
      {showFilters && (
        <Row style={{ marginTop: "16px" }}>
          <Col span={24}>
            <Checkbox.Group onChange={handleTagChange} value={selectedTags}>
              <Row gutter={[8, 8]}>
                {tagOptions.map((tag) => (
                  <Col span={6} key={tag.value}>
                    <Checkbox value={tag.value}>{tag.label}</Checkbox>
                  </Col>
                ))}
              </Row>
            </Checkbox.Group>
          </Col>
        </Row>
      )}
    </BoxContainer>
  );
};

export default PostFilter;
