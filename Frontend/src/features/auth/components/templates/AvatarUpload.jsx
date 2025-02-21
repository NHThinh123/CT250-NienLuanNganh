import { useState, useContext } from "react";
import { Upload, Avatar, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import axios from "../../../../services/axios.customize";
import { AuthContext } from "../../../../contexts/auth.context";

const AvatarUpload = ({ avatar, onUpdate }) => {
    const [imageUrl, setImageUrl] = useState(avatar);
    const { auth, setAuth } = useContext(AuthContext); // Lấy thông tin user từ context

    const userId = auth?.user?.id; // Lấy ID user đang đăng nhập

    const handleUpload = async (file) => {
        if (!userId) {
            message.error("Bạn chưa đăng nhập!");
            return;
        }

        const formData = new FormData();
        formData.append("avatar", file);

        try {
            // 🛠 Gửi file lên backend để cập nhật avatar
            const res = await axios.put(`/api/user/update/${userId}`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            console.log("API Response:", res.data);

            if (!res.data || !res.data.user || !res.data.user.avatar) {
                throw new Error("Dữ liệu API không hợp lệ!");
            }

            console.log("Upload thành công:", res.data);

            // Cập nhật avatar mới
            setImageUrl(res.data.user.avatar);
            message.success("Tải ảnh lên thành công!");

            // Cập nhật Context & localStorage với avatar mới
            const updatedUser = { ...auth.user, avatar: res.data.user.avatar };
            setAuth({ isAuthenticated: true, user: updatedUser });
            localStorage.setItem("authUser", JSON.stringify(updatedUser));

            if (onUpdate) {
                onUpdate(res.data.user.avatar); // Cập nhật ảnh ở component cha nếu cần
            }
        } catch (error) {
            console.error("Lỗi tải ảnh lên:", error);
            message.error("Lỗi tải ảnh lên.");
        }
    };

    return (
        <div style={{ textAlign: "center", marginBottom: 16 }}>
            <Avatar src={imageUrl} size={100} />
            <Upload showUploadList={false} customRequest={({ file }) => handleUpload(file)}>
                <p style={{ cursor: "pointer", color: "blue", marginTop: 8 }}>
                    <UploadOutlined /> Đổi ảnh đại diện
                </p>
            </Upload>
        </div>
    );
};

export default AvatarUpload;
