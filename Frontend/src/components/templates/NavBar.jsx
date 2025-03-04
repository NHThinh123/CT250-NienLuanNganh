import { FireFilled, HomeOutlined } from "@ant-design/icons";
import { Menu } from "antd";
import { Store } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";

// Định nghĩa items và ánh xạ path-to-key
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

const pathToKey = {
  "/": "home",
  "/posts": "post",
  "/businesses": "business",
};

const NavBar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const selectedKey = pathToKey[location.pathname] || "home"; // Lấy key từ path, mặc định là "home"

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
