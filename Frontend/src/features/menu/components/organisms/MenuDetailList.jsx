import { Col, List, Row } from "antd";
import DisplayDishesByMenu from "../molecules/DisplayDishesByMenu";
import { useContext } from "react";
import { MenuContext } from "../molecules/MenuContext";
import AddDish from "../molecules/AddDish";

const MenuDetailList = ({ menuData, capitalizeMenuName }) => {
  const { menuRefs } = useContext(MenuContext);

  return (
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
            style={styles.twocol}
          >
            <div>
              <Row>
                <Col span={22}>
                  <div
                    style={{
                      color: "#6D6f71",
                      fontSize: "14px",
                      paddingBottom: "20px",
                    }}
                  >
                    {capitalizeMenuName(menu.menu_name)}
                  </div>
                </Col>
                <Col span={2}>
                  <AddDish menuData={menu} />
                </Col>
              </Row>
            </div>
            <DisplayDishesByMenu menuId={menu._id} />
          </div>
        </List.Item>
      )}
    />
  );
};

const styles = {
  twocol: {
    backgroundColor: "#ffffff",
  },
};

export default MenuDetailList;
