import { ShareAltOutlined } from "@ant-design/icons";
import { Button, Typography } from "antd";

const ButtonShare = ({ post_id }) => {
  // Lấy origin và pathname từ window.location
  const { origin, pathname } = window.location;

  // Tách pathname thành các phần tử
  const pathParts = pathname.split("/").filter(Boolean); // Loại bỏ các phần tử rỗng

  // Tìm vị trí của "posts" trong URL và chỉ giữ phần sau nó
  const postsIndex = pathParts.indexOf("posts");
  const basePath =
    postsIndex !== -1 ? pathParts.slice(0, postsIndex + 1).join("/") : "";

  // Tạo linkShare với origin + basePath + post_id
  const linkShare = `${origin}/${basePath}/${post_id}`;

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Chia sẻ nội dung từ ứng dụng YUMZY",
          text: "Đây là nội dung tuyệt vời!",
          url: linkShare,
        });
        console.log("Chia sẻ thành công");
      } catch (error) {
        console.error("Lỗi khi chia sẻ:", error);
      }
    } else {
      alert("Trình duyệt không hỗ trợ Web Share API");
    }
  };

  return (
    <Button
      type="text"
      onClick={handleShare}
      style={{ padding: "10px", cursor: "pointer" }}
    >
      <ShareAltOutlined />
      <Typography.Text>Chia sẻ</Typography.Text>
    </Button>
  );
};

export default ButtonShare;
