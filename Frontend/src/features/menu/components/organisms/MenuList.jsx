import { Button, Menu } from "antd";
import { useContext, useState } from "react";
import { MenuContext } from "../molecules/MenuContext";
import DeleteMenu from "../molecules/DeleteMenu";
import UpdateMenu from "../molecules/UpdateMenu";
import BoxContainer from "../../../../components/atoms/BoxContainer";
import useDishByMenuId from "../../../dish/hooks/useDishByMenuId";

const removeAccents = (str) => {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D");
};

const MenuList = ({ menuData, searchKeyword }) => {
  const menuContext = useContext(MenuContext);
  const [showAll, setShowAll] = useState(false);

  if (!menuContext) {
    console.error("MenuList must be used within a MenuProvider");
    return null;
  }
  const MAX_VISIBLE_ITEMS = 4; // Giới hạn số lượng menu hiển thị ban đầu

  // Lọc các menu có món ăn khớp với từ khóa tìm kiếm
  const filteredMenu = menuData.filter((menu) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { dishData } = useDishByMenuId(menu._id);
    return dishData.some(
      (dish) =>
        removeAccents(dish.dish_name.toLowerCase()).includes(
          removeAccents(searchKeyword.toLowerCase())
        ) ||
        removeAccents(dish.dish_description.toLowerCase()).includes(
          removeAccents(searchKeyword.toLowerCase())
        )
    );
  });

  // Nếu không có menu nào khớp với từ khóa tìm kiếm, không hiển thị MenuList
  if (filteredMenu.length === 0) {
    return null;
  }

  const visibleMenu = showAll
    ? filteredMenu
    : filteredMenu.slice(0, MAX_VISIBLE_ITEMS);

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
          width: "100%",
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
        <div
          style={{
            display: "flex",
            gap: "4px", // Khoảng cách giữa các nút
          }}
        >
          <div>
            <UpdateMenu
              menuName={menu.menu_name}
              menuId={menu._id}
              businessId={menu.business_id}
            />
          </div>
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
        defaultSelectedKeys={[items[0]?.key]}
        mode="inline"
        items={items.map((item) => ({
          ...item,
          style: { paddingLeft: 15, paddingRight: 2 }, // Thêm padding cho từng item
        }))}
        onClick={(e) => handleMenuClick?.(e.key)}
      />
      {filteredMenu.length > MAX_VISIBLE_ITEMS && !showAll && (
        <Button
          type="link"
          onClick={() => setShowAll(true)}
          style={{
            fontSize: "14px",
            color: "#1890ff",
            maxWidth: "100%", // Giới hạn chiều rộng
            overflow: "hidden",
            whiteSpace: "nowrap",
            textOverflow: "ellipsis",
            display: "inline-block",
          }}
        >
          Xem thêm thực đơn...
        </Button>
      )}
    </BoxContainer>
  );
};

export default MenuList;
