import { Menu } from "antd";
import { useContext } from "react";
import { MenuContext } from "../molecules/MenuContext";
import DeleteMenu from "../molecules/DeleteMenu";

const MenuList = ({ menuData }) => {
  const menuContext = useContext(MenuContext);

  if (!menuContext) {
    console.error("MenuList must be used within a MenuProvider");
    return null;
  }

  const { handleMenuClick } = menuContext;

  //Duyệt qua mảng menuData để tạo ra mảng items
  const items = menuData.map((menu) => ({
    key: menu._id,
    label: (
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <span>{menu.menu_name.toUpperCase()}</span>
        <DeleteMenu menuName={menu.menu_name} menuId={menu._id} />
      </div>
    ),
  }));
  return (
    <>
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
        onClick={(e) => handleMenuClick?.(e.key)}
      />
    </>
  );
};

export default MenuList;
