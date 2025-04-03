import { useState, useEffect } from "react";
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
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  // Theo dõi kích thước màn hình
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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
      <Row
        gutter={[8, 8]} // Thêm gutter để tạo khoảng cách
        justify="center"
        align="middle"
        style={{ textAlign: "center" }}
      >
        <Col
          xs={24} // Mobile: Toàn chiều rộng
          sm={14} // Tablet nhỏ: 14/24
          md={16} // Tablet lớn: 16/24
          lg={16} // Desktop: 16/24
        >
          <Input.Search
            placeholder="Tìm kiếm bài viết"
            value={searchValue}
            onChange={handleInputChange}
            onSearch={handleSearchClick}
            enterButton
            size={windowWidth <= 576 ? "middle" : "large"} // Responsive size
            style={{
              width: "100%", // Chiếm toàn chiều rộng của Col
            }}
          />
        </Col>
        <Col
          xs={12} // Mobile: 12/24 (nửa chiều rộng)
          sm={6} // Tablet nhỏ: 6/24
          md={4} // Tablet lớn: 4/24
          lg={4} // Desktop: 4/24
        >
          <Select
            defaultValue="most_likes"
            onChange={handleSortChange}
            size={windowWidth <= 576 ? "middle" : "large"} // Responsive size
            style={{
              width: "100%", // Chiếm toàn chiều rộng của Col
            }}
          >
            <Option value="newest">Mới nhất</Option>
            <Option value="oldest">Cũ nhất</Option>
            <Option value="most_likes">Nhiều lượt thích</Option>
            <Option value="most_comments">Nhiều bình luận</Option>
          </Select>
        </Col>
        <Col
          xs={12} // Mobile: 12/24 (nửa chiều rộng)
          sm={4} // Tablet nhỏ: 4/24
          md={4} // Tablet lớn: 4/24
          lg={4} // Desktop: 4/24
        >
          <Button
            onClick={toggleFilters}
            block
            size={windowWidth <= 576 ? "middle" : "large"} // Responsive size
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 5,
            }}
          >
            <SlidersHorizontal size={windowWidth <= 576 ? 14 : 15} />
            {showFilters ? "Ẩn bộ lọc" : "Bộ lọc"}
          </Button>
        </Col>
      </Row>
      {showFilters && (
        <Row style={{ marginTop: windowWidth <= 576 ? 8 : 16 }}>
          <Col span={24}>
            <Checkbox.Group onChange={handleTagChange} value={selectedTags}>
              <Row gutter={[8, 8]}>
                {tagOptions.map((tag) => (
                  <Col
                    xs={12} // Mobile: 2 cột (12/24)
                    sm={8} // Tablet nhỏ: 3 cột (8/24)
                    md={6} // Tablet lớn: 4 cột (6/24)
                    lg={6} // Desktop: 4 cột (6/24)
                    key={tag.value}
                  >
                    <Checkbox
                      value={tag.value}
                      style={{
                        fontSize: windowWidth <= 576 ? "12px" : "14px", // Responsive font
                      }}
                    >
                      {tag.label}
                    </Checkbox>
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
