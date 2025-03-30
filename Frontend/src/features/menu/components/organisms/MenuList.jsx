import { Menu } from "antd";
import { useContext } from "react";
import { MenuContext } from "../molecules/MenuContext";
import DeleteMenu from "../molecules/DeleteMenu";
import UpdateMenu from "../molecules/UpdateMenu";
import BoxContainer from "../../../../components/atoms/BoxContainer";

const MenuList = ({ menuData }) => {
  const menuContext = useContext(MenuContext);

  if (!menuContext) {
    console.error("MenuList must be used within a MenuProvider");
    return <div>Không thể tải danh sách thực đơn. Vui lòng thử lại.</div>;
  }

  const { handleMenuClick } = menuContext;

  const items = menuData.map((menu) => ({
    key: menu._id,
    label: (
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          width: "100%",
        }}
      >
        <span
          style={{
            maxWidth: "160px",
            overflow: "hidden",
            whiteSpace: "nowrap",
            textOverflow: "ellipsis",
            display: "inline-block",
          }}
        >
          {menu.menu_name.toUpperCase()}
        </span>
        <div style={{ display: "flex", gap: "4px" }}>
          <UpdateMenu
            menuName={menu.menu_name}
            menuId={menu._id}
            businessId={menu.business_id}
          />
          <DeleteMenu
            menuName={menu.menu_name}
            menuId={menu._id}
            businessId={menu.business_id}
          />
        </div>
      </div>
    ),
  }));

  return (
    <BoxContainer>
      <Menu
        style={{
          fontSize: "13px",
          color: "#6D6f71",
          cursor: "pointer",
          borderInlineEnd: "none",
        }}
        defaultSelectedKeys={items.length > 0 ? [items[0].key] : []}
        mode="inline"
        items={items.map((item) => ({
          ...item,
          style: { paddingLeft: 15, paddingRight: 2 },
        }))}
        onClick={(e) => handleMenuClick?.(e.key)}
      />
    </BoxContainer>
  );
};

export default MenuList;
