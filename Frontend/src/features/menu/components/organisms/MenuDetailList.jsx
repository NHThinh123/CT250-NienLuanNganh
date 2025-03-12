import { Col, List, Row } from "antd";
import DisplayDishesByMenu from "../molecules/DisplayDishesByMenu";
import { useContext } from "react";
import { MenuContext } from "../molecules/MenuContext";
import AddDish from "../molecules/AddDish";
import BoxContainer from "../../../../components/atoms/BoxContainer";
import useDishByMenuId from "../../../dish/hooks/useDishByMenuId";

// Hàm chuyển đổi chuỗi thành dạng không dấu
const removeAccents = (str) => {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D");
};

const MenuDetailList = ({ menuData, capitalizeMenuName, searchKeyword }) => {
  const { menuRefs } = useContext(MenuContext);

  // Lọc các menu có món ăn khớp với từ khóa tìm kiếm không dấu
  const filteredMenuData = menuData.filter((menu) => {
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

  return (
    <BoxContainer>
      {filteredMenuData.length > 0 ? (
        <List
          grid={{ gutter: 16, column: 1 }}
          dataSource={filteredMenuData}
          renderItem={(menu) => (
            <List.Item>
              <div
                ref={(el) => {
                  if (menuRefs.current) {
                    menuRefs.current[menu._id] = el;
                  }
                }}
                data-menu-id={menu._id}
                style={styles.twocol}
              >
                <div>
                  <Row>
                    <Col span={23}>
                      <div
                        style={{
                          color: "#6D6f71",
                          fontSize: "15px",
                          paddingBottom: "18px",
                          fontWeight: "bold",
                        }}
                      >
                        {capitalizeMenuName(menu.menu_name)}
                      </div>
                    </Col>
                    <Col span={1}>
                      <div>
                        <AddDish menuData={menu} />
                      </div>
                    </Col>
                  </Row>
                </div>
                <DisplayDishesByMenu
                  menuId={menu._id}
                  businessId={menuData[0]?.business_id}
                  searchKeyword={searchKeyword}
                />
              </div>
            </List.Item>
          )}
        />
      ) : (
        <div
          style={{
            placeContent: "center",
            padding: "20px",
            fontSize: "16px",
            color: "#888",
            display: "flex",
          }}
        >
          Không tìm thấy món nào!
        </div>
      )}
      {menuData.length <= 0 && (
        <div
          style={{
            placeContent: "center",
            padding: "20px",
            fontSize: "16px",
            color: "#888",
            display: "flex",
          }}
        >
          Chưa có menu nào! Vui lòng thêm menu!
        </div>
      )}
    </BoxContainer>
  );
};

const styles = {
  twocol: {
    backgroundColor: "#ffffff",
  },
};

export default MenuDetailList;
