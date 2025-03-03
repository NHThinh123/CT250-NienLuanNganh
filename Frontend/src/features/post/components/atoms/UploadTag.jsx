import { Select } from "antd";

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
].map((tag) => ({ value: tag, label: tag }));

const UploadTag = ({ tags, setTags }) => {
  const handleChange = (selectedTags) => {
    setTags(selectedTags);
  };

  return (
    <Select
      mode="multiple"
      allowClear
      style={{ width: "100%" }}
      placeholder="Chọn chủ đề"
      value={tags}
      onChange={handleChange}
      options={tagOptions}
      dropdownRender={(menu) => (
        <>
          {menu}
          {/* {tags.length < tagOptions.length && (
            <Tag style={{ cursor: "pointer", margin: 4 }}>
              <PlusOutlined /> Thêm chủ đề
            </Tag>
          )} */}
        </>
      )}
    />
  );
};

export default UploadTag;
