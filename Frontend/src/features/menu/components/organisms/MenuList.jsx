import { Button, Menu } from "antd";
import { useContext, useState } from "react";
import { MenuContext } from "../molecules/MenuContext";
import DeleteMenu from "../molecules/DeleteMenu";

const MenuList = ({ menuData }) => {
  const menuContext = useContext(MenuContext);
  const [showAll, setShowAll] = useState(false);

  if (!menuContext) {
    console.error("MenuList must be used within a MenuProvider");
    return null;
  }
  const MAX_VISIBLE_ITEMS = 4; // Giới hạn số lượng menu hiển thị ban đầu

  const visibleMenu = showAll ? menuData : menuData.slice(0, MAX_VISIBLE_ITEMS);

  const { handleMenuClick } = menuContext;

  //Duyệt qua mảng menuData để tạo ra mảng items
  const items = visibleMenu.map((menu) => ({
    key: menu._id,
    label: (
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <span
          style={{
            maxWidth: "160px", // Giới hạn chiều rộng
            overflow: "hidden",
            whiteSpace: "nowrap",
            textOverflow: "ellipsis",
            display: "inline-block",
          }}
        >
          {menu.menu_name.toUpperCase()}
        </span>
        <DeleteMenu
          menuName={menu.menu_name}
          menuId={menu._id}
          businessId={menu.business_id}
        />
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
        items={items.map((item) => ({
          ...item,
          style: { paddingLeft: 15, paddingRight: 2 }, // Thêm padding cho từng item
        }))}
        onClick={(e) => handleMenuClick?.(e.key)}
      />
      {menuData.length > MAX_VISIBLE_ITEMS && !showAll && (
        <Button
          type="link"
          onClick={() => setShowAll(true)}
          style={{ marginTop: "8px", fontSize: "14px", color: "#1890ff" }}
        >
          Xem thêm thực đơn...
        </Button>
      )}
    </>
  );
};

export default MenuList;
