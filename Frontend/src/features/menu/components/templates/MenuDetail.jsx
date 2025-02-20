import { Col, Row, Menu, List } from "antd";
import DisplayDishesByMenu from "../organisms/DisplayDishesByMenu";
import { useRef } from "react";

const MenuDetail = ({ menuData, isLoadingMenu, isErrorMenu }) => {
  const menuRefs = useRef({}); // Lưu trữ ref của từng menu

  if (isLoadingMenu) {
    return <h1>Loading...</h1>;
  }

  if (isErrorMenu) {
    return <h1>Error...</h1>;
  }

  // Khi nhấn vào menu => Cuộn trang web đến vị trí menu tương ứng
  const handleMenuClick = (e) => {
    const menuId = e.key;
    const element = menuRefs.current[menuId];

    if (element) {
      const offsetTop =
        element.getBoundingClientRect().top + window.scrollY - 50; // 50px để tránh bị che
      window.scrollTo({ top: offsetTop, behavior: "smooth" });
    }
  };

  //In hoa tên menu
  const capitalizeMenuName = (name) => {
    return name.toUpperCase();
  };

  //Duyệt qua mảng menuData để tạo ra mảng items
  const items = menuData.map((menu) => ({
    key: menu._id,
    label: capitalizeMenuName(menu.menu_name),
  }));

  return (
    <>
      <div style={styles.menuPage}>
        <Row>
          <Col span={3}></Col>
          <Col span={4}>
            <div style={{ padding: "13px 26px" }}>
              <p style={styles.titleMenu}>THỰC ĐƠN</p>
            </div>
          </Col>
        </Row>
        <Row>
          <Col span={3}></Col>
          <Col span={4}>
            <div style={{ marginRight: "20px" }}>
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
                onClick={handleMenuClick}
              ></Menu>
            </div>
          </Col>
          <Col
            span={9}
            style={{
              backgroundColor: "#ffffff",
              padding: "6px 15px",
              borderRadius: "5px",
            }}
          >
            <List
              grid={{ gutter: 16, column: 1 }}
              dataSource={menuData}
              renderItem={(menu) => (
                <List.Item>
                  <div
                    ref={(el) => (menuRefs.current[menu._id] = el)}
                    style={styles.twocol}
                  >
                    <div
                      style={{
                        color: "#6D6f71",
                        fontSize: "14px",
                        paddingBottom: "20px",
                      }}
                    >
                      {capitalizeMenuName(menu.menu_name)}
                    </div>
                    <DisplayDishesByMenu menuId={menu._id} />
                  </div>
                </List.Item>
              )}
            />
          </Col>
          <Col span={5}>
            <div
              style={{
                backgroundColor: "#ffffff",
                height: "300px",
                marginLeft: "20px",
              }}
            >
              <iframe
                width="100%"
                height="100%"
                frameBorder="0"
                style={{ border: 0 }}
                src="https://www.google.com/maps/embed/v1/place?q=Ho%20Chi%20Minh%20City,Vietnam&key=YOUR_GOOGLE_MAPS_API_KEY"
                allowFullScreen
              ></iframe>
            </div>
          </Col>

          <Col span={3}></Col>
        </Row>
      </div>
    </>
  );
};

const styles = {
  menuPage: {
    backgroundColor: "#F5F5F5",
  },
  titleMenu: {
    fontSize: "14px",
    fontWeight: "bold",
    color: "#CF2127",
  },
  onecol: {
    backgroundColor: "#ffffff",
  },
  twocol: {
    backgroundColor: "#ffffff",
  },
};

export default MenuDetail;
