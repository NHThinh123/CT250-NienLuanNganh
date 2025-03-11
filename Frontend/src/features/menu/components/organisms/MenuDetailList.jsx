import { Col, List, Row } from "antd";
import DisplayDishesByMenu from "../molecules/DisplayDishesByMenu";
import { useContext } from "react";
import { MenuContext } from "../molecules/MenuContext";
import AddDish from "../molecules/AddDish";

const MenuDetailList = ({ menuData, capitalizeMenuName }) => {
  const { menuRefs } = useContext(MenuContext);

  return (
    <>
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
          Chưa có thực đơn! Vui lòng thêm thực đơn!
        </div>
      )}
    </>
  );
};

const styles = {
  twocol: {
    backgroundColor: "#ffffff",
  },
};

export default MenuDetailList;
