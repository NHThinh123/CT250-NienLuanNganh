import { Typography, Upload, message } from "antd";
import { ImageUp } from "lucide-react";
import { useState, useEffect } from "react";

const UploadMedia = ({ fileList, setFileList }) => {
  const [previewURLs, setPreviewURLs] = useState([]);

  const MAX_FILE_SIZE_MB = 10;
  const ACCEPTED_FILE_TYPES = ["image/*", "video/*"];

  // Cập nhật previewURLs khi fileList thay đổi
  useEffect(() => {
    const urls = fileList
      .map((file) => {
        if (!file) return null; // Kiểm tra file có tồn tại không
        if (file.url) return file.url; // URL từ backend
        if (file.originFileObj) return URL.createObjectURL(file.originFileObj); // File mới
        return null;
      })
      .filter(Boolean);
    setPreviewURLs(urls);
  }, [fileList]);

  const handleChange = ({ fileList: newFileList }) => {
    setFileList(newFileList); // Cập nhật fileList qua callback từ parent
  };

  const beforeUpload = (file) => {
    const isValidType =
      file.type.startsWith("image/") || file.type.startsWith("video/");
    if (!isValidType) {
      message.error("Bạn chỉ có thể tải lên ảnh hoặc video!");
      return Upload.LIST_IGNORE;
    }

    const fileSizeMB = file.size / 1024 / 1024;
    if (fileSizeMB > MAX_FILE_SIZE_MB) {
      message.error(`File phải nhỏ hơn ${MAX_FILE_SIZE_MB}MB!`);
      return Upload.LIST_IGNORE;
    }

    return false; // Ngăn upload tự động
  };

  const renderPreview = (src, file, index) => {
    // Kiểm tra file có tồn tại không trước khi truy cập thuộc tính
    if (!file || !src) return null;

    const isImage =
      file.type?.startsWith("image/") ||
      file.url?.match(/\.(jpg|jpeg|png|gif)$/i);
    const isVideo =
      file.type?.startsWith("video/") || file.url?.match(/\.(mp4|mov|avi)$/i);

    if (isImage) {
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
    } else if (isVideo) {
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
        accept={ACCEPTED_FILE_TYPES.join(",")}
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
