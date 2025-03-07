import { FireFilled, HomeOutlined } from "@ant-design/icons";
import { Menu } from "antd";
import { Store } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";

// Định nghĩa items và ánh xạ base path-to-key
const items = [
  { label: <Link to="/">Trang chủ</Link>, key: "home", icon: <HomeOutlined /> },
  {
    label: <Link to="/posts">Bài viết</Link>,
    key: "post",
    icon: <FireFilled style={{ color: "red" }} />,
  },
  {
    label: <Link to="/businesses">Quán ăn</Link>,
    key: "business",
    icon: <Store size={15} />,
  },
];

// Ánh xạ base path-to-key
const pathToKey = {
  "/": "home",
  "/posts": "post",
  "/businesses": "business",
};

const NavBar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Tìm key tương ứng với path hiện tại (hỗ trợ sub-route)
  const getSelectedKey = () => {
    const currentPath = location.pathname;

    // Kiểm tra xem path hiện tại bắt đầu bằng base path nào
    for (const [basePath, key] of Object.entries(pathToKey)) {
      if (currentPath === basePath || currentPath.startsWith(basePath + "/")) {
        return key;
      }
    }
    return "home"; // Mặc định về "home" nếu không khớp
  };

  const selectedKey = getSelectedKey();

  const handleClick = ({ key }) => {
    const path = Object.keys(pathToKey).find((p) => pathToKey[p] === key);
    if (path) navigate(path);
  };

  return (
    <div>
      <Menu
        items={items}
        mode="horizontal"
        selectedKeys={[selectedKey]}
        onClick={handleClick}
      />
    </div>
  );
};

export default NavBar;
