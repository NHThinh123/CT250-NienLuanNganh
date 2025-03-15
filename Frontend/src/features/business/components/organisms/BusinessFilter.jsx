import { useState } from "react";
import BoxContainer from "../../../../components/atoms/BoxContainer";
import { Input, Row, Col } from "antd";

const BusinessFilter = ({
  handleSearch,
  //   handleSortChange,
  //   handleTagFilter,
}) => {
  const [searchValue, setSearchValue] = useState("");

  const handleInputChange = (e) => {
    setSearchValue(e.target.value);
  };

  const handleSearchClick = () => {
    handleSearch(searchValue);
  };
  //   const [searchValue, setSearchValue] = useState("");
  //   const [selectedTags, setSelectedTags] = useState([]);
  //   const [showFilters, setShowFilters] = useState(false);

  //   const handleInputChange = (e) => {
  //     setSearchValue(e.target.value);
  //   };

  //   const handleSearchClick = () => {
  //     handleSearch(searchValue);
  //   };

  //   const handleTagChange = (checkedValues) => {
  //     setSelectedTags(checkedValues);
  //     handleTagFilter(checkedValues);
  //   };

  //   const toggleFilters = () => {
  //     setShowFilters(!showFilters);
  //   };

  return (
    <BoxContainer>
      <Row>
        <Col span={4}></Col>
        <Col span={16}>
          <Input.Search
            placeholder="Tìm kiếm quán ăn"
            value={searchValue}
            onChange={handleInputChange}
            onSearch={handleSearchClick}
            enterButton
            // style={{ paddingRight: "10px" }}
          />
        </Col>
        <Col span={4}>
          {/* <Select
            defaultValue="most_likes"
            style={{ width: 150 }}
            onChange={handleSortChange}
          >
            <Option value="newest">Mới nhất</Option>
            <Option value="oldest">Cũ nhất</Option>
            <Option value="most_likes">Nhiều lượt thích</Option>
            <Option value="most_comments">Nhiều bình luận</Option>
          </Select> */}
        </Col>
        {/* <Col span={4} style={{ paddingLeft: "8px" }}></Col> */}
      </Row>
      {/* {showFilters && (
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
      )} */}
    </BoxContainer>
  );
};

export default BusinessFilter;
