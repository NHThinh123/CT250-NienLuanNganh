import { FireFilled, MailOutlined } from "@ant-design/icons";
import { Menu } from "antd";
import { Link } from "react-router-dom";
const items = [
  {
    label: <Link to="/">Trang chủ</Link>,
    key: "home",
    icon: <MailOutlined />,
  },
  {
    label: <Link to="/posts">Bài viết</Link>,
    key: "post",
    icon: <FireFilled style={{ color: "red" }} />,
  },
];
const NavBar = () => {
  return (
    <div>
      <Menu
        items={items}
        mode="horizontal"
        style={{ paddingTop: 8, paddingBottom: 8 }}
      ></Menu>
    </div>
  );
};

export default NavBar;
