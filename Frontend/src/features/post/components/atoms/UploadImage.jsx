import { Typography, Upload } from "antd";
import { ImageUp } from "lucide-react";
import { useState } from "react";

const UploadImage = ({ fileList, setFileList }) => {
  const [previewURLs, setPreviewURLs] = useState([]);

  const handleChange = ({ fileList }) => {
    setFileList(fileList);

    const newPreviewURLs = fileList.map((file) =>
      file.originFileObj ? URL.createObjectURL(file.originFileObj) : file.url
    );

    setPreviewURLs(newPreviewURLs);
  };

  //   const handleUpload = async () => {
  //     if (fileList.length === 0) {
  //       alert("Vui lòng chọn ảnh trước khi upload!");
  //       return;
  //     }

  //     const formData = new FormData();
  //     fileList.forEach((file) => {
  //       formData.append("image", file.originFileObj);
  //     });

  //     try {
  //       const response = await fetch("http://localhost:5000/upload", {
  //         method: "POST",
  //         body: formData,
  //       });

  //       const data = await response.json();
  //       console.log("Uploaded URLs:", data);
  //     } catch (error) {
  //       console.error("Upload error:", error);
  //     }
  //   };

  return (
    <>
      <div>
        {previewURLs.map((src, index) => (
          <img
            key={index}
            src={src}
            alt="preview"
            style={{ maxWidth: "600px", maxHeight: "270px", marginTop: "8px" }}
          />
        ))}
      </div>
      <Upload.Dragger
        name="images"
        multiple={true}
        beforeUpload={() => false}
        onChange={handleChange}
        style={{ maxHeight: "200px", marginBottom: "16px", marginTop: "8px" }}
        fileList={fileList}
      >
        <ImageUp />
        <br />
        <Typography.Text>Thêm ảnh/video</Typography.Text>
      </Upload.Dragger>
    </>
  );
};

export default UploadImage;
