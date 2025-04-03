import { FireFilled, HomeOutlined } from "@ant-design/icons";
import { Menu } from "antd";
import { Store } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";

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

  const getSelectedKey = () => {
    const currentPath = location.pathname;
    for (const [basePath, key] of Object.entries(pathToKey)) {
      if (currentPath === basePath || currentPath.startsWith(basePath + "/")) {
        return key;
      }
    }
    return "home";
  };

  const selectedKey = getSelectedKey();

  const handleClick = ({ key }) => {
    const path = Object.keys(pathToKey).find((p) => pathToKey[p] === key);
    if (path) navigate(path);
  };

  return (
    <Menu
      items={items}
      mode={window.innerWidth <= 768 ? "vertical" : "horizontal"}
      selectedKeys={[selectedKey]}
      onClick={handleClick}
    />
  );
};

export default NavBar;
