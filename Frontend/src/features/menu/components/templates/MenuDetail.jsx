import { Col, Row } from "antd";
import { MenuProvider } from "../molecules/MenuContext";
import MenuList from "../organisms/MenuList";
import MenuDetailList from "../organisms/MenuDetailList";
import ReviewList from "../../../review/components/templates/ReviewList";
import useReviewByBusinessId from "../../../review/hooks/useReviewByBusinessId";

const MenuDetail = ({ menuData, isLoadingMenu, isErrorMenu, business_id }) => {
  const reviewData = useReviewByBusinessId(business_id);
  if (isLoadingMenu) {
    return <h1>Loading...</h1>;
  }

  if (isErrorMenu) {
    return <h1>Error...</h1>;
  }

  //In hoa tên menu
  const capitalizeMenuName = (name) => {
    return name.toUpperCase();
  };
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
          <Col span={8}></Col>
          <Col span={8}>
            <div style={{ padding: "13px 26px" }}>
              <p style={styles.titleMenu}>ĐÁNH GIÁ</p>
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
                marginLeft: "20px",
              }}
            >
              <div>
                <ReviewList reviewData={reviewData.reviewData}></ReviewList>
              </div>
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
