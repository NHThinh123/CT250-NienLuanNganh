import { BankOutlined, FireFilled, MailOutlined } from "@ant-design/icons";
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
  {
    label: <Link to="/businesses">Quán ăn</Link>,
    key: "business",
    icon: <BankOutlined style={{ color: "blue" }} />,
  },
];
const NavBar = () => {
  return (
    <div>
      <Menu items={items} mode="horizontal"></Menu>
    </div>
  );
};

export default NavBar;
