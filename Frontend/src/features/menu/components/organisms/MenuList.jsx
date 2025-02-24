import { Menu } from "antd";
import { useContext } from "react";
import { MenuContext } from "../molecules/MenuContext";

const MenuList = (menuData) => {
  const { handleMenuClick } = useContext(MenuContext);

  //Duyệt qua mảng menuData để tạo ra mảng items
  const items = menuData.menuData.map((menu) => ({
    key: menu._id,
    label: menu.menu_name.toUpperCase(),
  }));
  return (
    <Menu
      style={{
        borderRadius: "5px",
        fontSize: "13px",
        color: "#6D6f71",
        cursor: "pointer",
      }}
      defaultSelectedKeys={[items[0]?.key]}
      mode="inline"
      items={items}
      onClick={(e) => handleMenuClick(e.key)}
    />
  );
};

export default MenuList;
