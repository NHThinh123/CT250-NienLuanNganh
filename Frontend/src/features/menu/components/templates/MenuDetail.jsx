import { Col, Row } from "antd";
import { MenuProvider } from "../molecules/MenuContext";
import MenuList from "../organisms/MenuList";
import MenuDetailList from "../organisms/MenuDetailList";
// import ReviewList from "../../../review/components/templates/ReviewList";

const MenuDetail = ({ menuData, isLoadingMenu, isErrorMenu }) => {
  // const menuRefs = useRef({}); // Lưu trữ ref của từng menu

  if (isLoadingMenu) {
    return <h1>Loading...</h1>;
  }

  if (isErrorMenu) {
    return <h1>Error...</h1>;
  }

  // Khi nhấn vào menu => Cuộn trang web đến vị trí menu tương ứng
  // const handleMenuClick = (e) => {
  //   const menuId = e.key;
  //   const element = menuRefs.current[menuId];

  //   if (element) {
  //     const offsetTop =
  //       element.getBoundingClientRect().top + window.scrollY - 50; // 50px để tránh bị che
  //     window.scrollTo({ top: offsetTop, behavior: "smooth" });
  //   }
  // };

  //In hoa tên menu
  const capitalizeMenuName = (name) => {
    return name.toUpperCase();
  };

  //Duyệt qua mảng menuData để tạo ra mảng items
  // const items = menuData.map((menu) => ({
  //   key: menu._id,
  //   label: capitalizeMenuName(menu.menu_name),
  // }));

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
          <MenuProvider>
            <Col span={4}>
              <div style={{ marginRight: "20px" }}>
                <MenuList menuData={menuData}></MenuList>
              </div>
            </Col>
            <Col
              span={8}
              style={{
                backgroundColor: "#ffffff",
                padding: "6px 15px",
                borderRadius: "5px",
              }}
            >
              <MenuDetailList
                menuData={menuData}
                capitalizeMenuName={capitalizeMenuName}
              ></MenuDetailList>
            </Col>
          </MenuProvider>
          <Col span={6}>
            <div
              style={{
                backgroundColor: "#ffffff",
                height: "300px",
                marginLeft: "20px",
              }}
            >
              {/* <ReviewList businessId={businessId}></ReviewList> */}
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
