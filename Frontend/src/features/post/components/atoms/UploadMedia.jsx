import { Typography, Upload, message } from "antd";
import { ImageUp } from "lucide-react";
import { useState } from "react";

const UploadMedia = ({ fileList, setFileList }) => {
  const [previewURLs, setPreviewURLs] = useState([]);

  const MAX_FILE_SIZE_MB = 10; // Giới hạn kích thước file (MB)
  const ACCEPTED_FILE_TYPES = ["image/*", "video/*"]; // Các loại file được phép

  const handleChange = ({ fileList: newFileList }) => {
    // Cập nhật fileList
    setFileList(newFileList);

    // Tạo URL preview cho từng file
    const newPreviewURLs = newFileList.map((file) =>
      file.originFileObj ? URL.createObjectURL(file.originFileObj) : file.url
    );
    setPreviewURLs(newPreviewURLs);
  };

  const beforeUpload = (file) => {
    // Ràng buộc loại file
    const isValidType =
      file.type.startsWith("image/") || file.type.startsWith("video/");
    if (!isValidType) {
      message.error("Bạn chỉ có thể tải lên ảnh hoặc video!");
      return Upload.LIST_IGNORE;
    }

    // Ràng buộc kích thước file
    const fileSizeMB = file.size / 1024 / 1024; // Chuyển sang MB
    const isWithinSizeLimit = fileSizeMB <= MAX_FILE_SIZE_MB;
    if (!isWithinSizeLimit) {
      message.error(`File phải nhỏ hơn ${MAX_FILE_SIZE_MB}MB!`);
      return Upload.LIST_IGNORE;
    }

    return false; // Ngăn upload tự động, chờ form submit
  };

  // Tùy chỉnh render preview
  const renderPreview = (src, file, index) => {
    if (file.type.startsWith("image/")) {
      return (
        <img
          key={index}
          src={src}
          alt="preview"
          style={{
            maxWidth: "600px",
            maxHeight: "300px",
            marginTop: "8px",
            objectFit: "cover",
          }}
        />
      );
    } else if (file.type.startsWith("video/")) {
      return (
        <video
          key={index}
          src={src}
          controls
          style={{
            maxWidth: "600px",
            maxHeight: "300px",
            marginTop: "8px",
            objectFit: "cover",
          }}
        />
      );
    }
    return null;
  };

  return (
    <>
      <div>
        {previewURLs.map((src, index) =>
          renderPreview(src, fileList[index], index)
        )}
      </div>
      <Upload.Dragger
        name="media"
        multiple={true}
        beforeUpload={beforeUpload}
        onChange={handleChange}
        fileList={fileList}
        accept={ACCEPTED_FILE_TYPES.join(",")} // "image/*,video/*"
        style={{
          maxHeight: "200px",
          marginBottom: "16px",
          marginTop: "8px",
        }}
      >
        <ImageUp size={48} strokeWidth={1.5} />
        <br />
        <Typography.Text>Thêm ảnh hoặc video</Typography.Text>
      </Upload.Dragger>
    </>
  );
};

export default UploadMedia;
