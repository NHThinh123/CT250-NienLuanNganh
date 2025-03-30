import { List } from "antd";
import DisplayDishesByMenu from "../molecules/DisplayDishesByMenu";
import { useContext } from "react";
import { MenuContext } from "../molecules/MenuContext";
import AddDish from "../molecules/AddDish";
import BoxContainer from "../../../../components/atoms/BoxContainer";

const MenuDetailList = ({ menuData, capitalizeMenuName, searchKeyword }) => {
  const { menuRefs } = useContext(MenuContext);

  return (
    <BoxContainer>
      {menuData.length > 0 ? (
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
                style={styles.twocol}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    width: "100%",
                  }}
                >
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
                  <div>
                    <AddDish menuData={menu} />
                  </div>
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
      {menuData.length == 0 && (
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
