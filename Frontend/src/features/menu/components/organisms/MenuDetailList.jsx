import { Col, List, Row } from "antd";
import DisplayDishesByMenu from "../molecules/DisplayDishesByMenu";
import { useContext, useMemo } from "react";
import { MenuContext } from "../molecules/MenuContext";
import AddDish from "../molecules/AddDish";
import BoxContainer from "../../../../components/atoms/BoxContainer";
import useDishByMenuId from "../../../dish/hooks/useDishByMenuId";

// Hàm loại bỏ dấu trong chuỗi
const removeAccents = (str) =>
  str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D");

const MenuDetailList = ({ menuData, capitalizeMenuName, searchKeyword }) => {
  const { menuRefs } = useContext(MenuContext);

  // // Lấy danh sách món ăn theo từng menu
  // const dishesByMenu = menuData.map((menu) => {
  //   // eslint-disable-next-line react-hooks/rules-of-hooks
  //   const { dishData = [], isLoading } = useDishByMenuId(menu._id) || {};

  //   return { menuId: menu._id, dishData, isLoading };
  // });

  // // Lọc menu theo từ khóa tìm kiếm
  // const filteredMenuData = useMemo(() => {
  //   if (!menuData || !Array.isArray(menuData)) return [];
  //   if (!searchKeyword) return menuData; // Nếu không có từ khóa, hiển thị tất cả

  //   const searchText = removeAccents(searchKeyword.toLowerCase());

  //   return menuData.filter((menu) => {
  //     const dishInfo = dishesByMenu.find((item) => item.menuId === menu._id);
  //     if (!dishInfo || !dishInfo.dishData.length) return false;

  //     return dishInfo.dishData.some((dish) =>
  //       [dish.dish_name, dish.dish_description].some((text) =>
  //         removeAccents(text.toLowerCase()).includes(searchText)
  //       )
  //     );
  //   });
  // }, [menuData, dishesByMenu, searchKeyword]);

  return (
    <BoxContainer>
      {/* {filteredMenuData.length > 0 ? ( */}
      <List
        grid={{ gutter: 16, column: 1 }}
        dataSource={menuData}
        renderItem={(menu) => (
          <List.Item>
            <div
              ref={(el) => {
                if (menuRefs.current) {
                  menuRefs.current[menu._id] = el;
                }
              }}
              data-menu-id={menu._id}
              style={styles.menuContainer}
            >
              <Row>
                <Col span={23}>
                  <div style={styles.menuTitle}>
                    {capitalizeMenuName(menu.menu_name)}
                  </div>
                </Col>
                <Col span={1}>
                  <AddDish menuData={menu} />
                </Col>
              </Row>
              <DisplayDishesByMenu
                menuId={menu._id}
                businessId={menuData[0]?.business_id}
                searchKeyword={searchKeyword}
              />
            </div>
          </List.Item>
        )}
      />
      {/* ) : (
        <div style={styles.emptyMessage}>Không tìm thấy món nào!</div>
      )} */}

      {/* {menuData.length === 0 && (
        <div style={styles.emptyMessage}>
          Chưa có menu nào! Vui lòng thêm menu!
        </div>
      )} */}
    </BoxContainer>
  );
};

// Styles
const styles = {
  menuContainer: {
    backgroundColor: "#ffffff",
  },
  menuTitle: {
    color: "#6D6f71",
    fontSize: "15px",
    paddingBottom: "18px",
    fontWeight: "bold",
  },
  emptyMessage: {
    display: "flex",
    placeContent: "center",
    padding: "20px",
    fontSize: "16px",
    color: "#888",
  },
};

export default MenuDetailList;
