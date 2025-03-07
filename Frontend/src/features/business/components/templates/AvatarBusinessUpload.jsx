import { useState, useContext } from "react";
import { Upload, Avatar, message, Spin } from "antd";
import { UploadOutlined, LoadingOutlined } from "@ant-design/icons";
import { useUpdateProfileBusiness } from "../../hooks/useProfileBusiness";
import { BusinessContext } from "../../../../contexts/business.context";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/gif"];

const AvatarBusinessUpload = ({ avatar }) => {
  const [imageUrl, setImageUrl] = useState(avatar);
  const [isUploading, setIsUploading] = useState(false);
  const { business, setBusiness } = useContext(BusinessContext);
  const updateProfile = useUpdateProfileBusiness();

  const validateFile = (file) => {
    if (file.size > MAX_FILE_SIZE) {
      message.error("File không được vượt quá 5MB");
      return false;
    }
    if (!ALLOWED_TYPES.includes(file.type)) {
      message.error("Chỉ chấp nhận file ảnh định dạng JPG, PNG hoặc GIF");
      return false;
    }
    return true;
  };

  const handleUpload = async (file) => {
    if (!business.isAuthenticated || !business.business.id) {
      message.error("Bạn chưa đăng nhập!");
      return;
    }

    if (!validateFile(file)) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append("avatar", file);

    try {
      const result = await updateProfile.mutateAsync({
        id: business.business.id,
        data: formData,
      });

      if (!result.business.avatar) {
        throw new Error("INVALID_RESPONSE");
      }

      setImageUrl(result.business.avatar);
      message.success("Tải ảnh lên thành công!");

      // Cập nhật Context & localStorage
      const updatedBusiness = {
        ...business,
        business: { ...business.business, avatar: result.business.avatar },
      };

      setBusiness(updatedBusiness);
      localStorage.setItem("authBusiness", JSON.stringify(updatedBusiness));
    } catch (error) {
      let errorMessage = "Đã có lỗi xảy ra khi tải ảnh lên.";

      if (error.response) {
        switch (error.response.status) {
          case 400:
            errorMessage = "File không hợp lệ. Vui lòng kiểm tra lại.";
            break;
          case 401:
            errorMessage =
              "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.";
            break;
          case 413:
            errorMessage = "Kích thước file quá lớn.";
            break;
          case 500:
            errorMessage = "Lỗi server. Vui lòng thử lại sau.";
            break;
        }
      } else if (error.message === "INVALID_RESPONSE") {
        errorMessage = "Dữ liệu trả về không hợp lệ. Vui lòng thử lại.";
      } else if (error.message === "Network Error") {
        errorMessage = "Lỗi kết nối mạng. Vui lòng kiểm tra kết nối.";
      }

      console.error("Lỗi tải ảnh:", error);
      message.error(errorMessage);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div style={{ textAlign: "center", marginBottom: 16 }}>
      <div style={{ position: "relative", display: "inline-block" }}>
        <div
          style={{
            width: 280,
            height: 140,
            overflow: "hidden",
            borderRadius: 5,
          }}
        >
          <img
            src={imageUrl}
            alt="avatar"
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </div>

        {isUploading && (
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              background: "rgba(255, 255, 255, 0.7)",
              borderRadius: "50%",
            }}
          >
            <Spin
              indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />}
            />
          </div>
        )}
      </div>
      <div style={{ marginTop: 8 }}>
        <Upload
          showUploadList={false}
          customRequest={({ file }) => handleUpload(file)}
          disabled={isUploading}
        >
          <p
            style={{
              cursor: isUploading ? "not-allowed" : "pointer",
              color: isUploading ? "#999" : "blue",
            }}
          >
            <UploadOutlined />{" "}
            {isUploading ? "Đang tải lên..." : "Đổi ảnh đại diện"}
          </p>
        </Upload>
      </div>
    </div>
  );
};

export default AvatarBusinessUpload;
