import { Col, Row } from "antd";
import { MenuProvider } from "../molecules/MenuContext";
import MenuList from "../organisms/MenuList";
import MenuDetailList from "../organisms/MenuDetailList";
import ReviewList from "../../../review/components/templates/ReviewList";
import useReviewByBusinessId from "../../../review/hooks/useReviewByBusinessId";
import AddMenu from "../molecules/AddMenu";
import CreateReview from "../../../review/components/templates/CreateReview";

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
          <Col span={2}></Col>
          <Col span={5}>
            <div style={{ padding: "13px 26px" }}>
              <p style={styles.titleMenu}>THỰC ĐƠN</p>
            </div>
          </Col>
          <Col span={9}></Col>
          <Col span={8}>
            <div style={{ padding: "13px 26px", marginLeft: 20 }}>
              <p style={styles.titleMenu}>ĐÁNH GIÁ</p>
            </div>
          </Col>
        </Row>
        <Row>
          <Col span={2}></Col>
          <MenuProvider>
            <Col span={4}>
              <div style={{ marginRight: "20px", position: "sticky", top: 70 }}>
                <MenuList menuData={menuData}></MenuList>
                <div
                  style={{
                    backgroundColor: "white",
                    borderRadius: "5px",
                    marginTop: "10px",
                  }}
                >
                  <AddMenu businessId={business_id} />
                </div>
              </div>
            </Col>
            <Col
              span={10}
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
                borderRadius: 5,
                position: "sticky",
                top: 70,
              }}
            >
              <div>
                <ReviewList reviewData={reviewData.reviewData} />
              </div>
              <hr
                style={{
                  height: "3px",
                  border: "no",
                  opacity: "0.5",
                  margin: "15px 15px 5px 15px",
                }}
              />
              <div
                style={{
                  backgroundColor: "white",
                  borderRadius: "5px",
                }}
              >
                <CreateReview businessId={business_id} />
              </div>
            </div>
          </Col>
          <Col span={2}></Col>
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
    margin: 0,
  },
  onecol: {
    backgroundColor: "#ffffff",
  },
  twocol: {
    backgroundColor: "#ffffff",
  },
};

export default MenuDetail;
