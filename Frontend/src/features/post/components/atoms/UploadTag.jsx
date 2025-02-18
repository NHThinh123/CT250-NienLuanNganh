import { PlusOutlined } from "@ant-design/icons";
import { Input, Tag } from "antd";
import { useEffect, useRef, useState } from "react";

const UploadTag = ({ tags, setTags }) => {
  const [inputVisible, setInputVisible] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef(null);
  useEffect(() => {
    if (inputVisible) {
      inputRef.current?.focus();
    }
  }, [inputVisible]);
  const handleClose = (removedTag) => {
    const newTags = tags?.filter((tag) => tag !== removedTag);
    console.log(newTags);
    setTags(newTags);
  };
  const showInput = () => {
    setInputVisible(true);
  };
  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };
  const handleInputConfirm = () => {
    if (inputValue && tags?.indexOf(inputValue) === -1) {
      setTags([...tags, inputValue]);
    }
    setInputVisible(false);
    setInputValue("");
  };
  const forMap = (tag) => (
    <span
      key={tag}
      style={{
        display: "inline-block",
        marginBottom: "8px",
      }}
    >
      <Tag
        closable
        onClose={(e) => {
          e.preventDefault();
          handleClose(tag);
        }}
        color="blue"
      >
        {tag}
      </Tag>
    </span>
  );
  const tagChild = tags?.map(forMap);
  const tagPlusStyle = {
    borderStyle: "dashed",
    cursor: "pointer",
  };
  return (
    <>
      <div>{tagChild}</div>
      {inputVisible ? (
        <Input
          ref={inputRef}
          type="text"
          size="small"
          style={{
            width: 78,
          }}
          value={inputValue}
          onChange={handleInputChange}
          onBlur={handleInputConfirm}
          onPressEnter={handleInputConfirm}
        />
      ) : (
        <Tag onClick={showInput} style={tagPlusStyle}>
          <PlusOutlined /> Thêm chủ đề
        </Tag>
      )}
    </>
  );
};

export default UploadTag;
