import { Col, Row } from "antd";
import { MenuProvider } from "../molecules/MenuContext";
import MenuList from "../organisms/MenuList";
import MenuDetailList from "../organisms/MenuDetailList";
import ReviewList from "../../../review/components/templates/ReviewList";
import useReviewByBusinessId from "../../../review/hooks/useReviewByBusinessId";
import AddMenu from "../molecules/AddMenu";
import CreateReview from "../../../review/components/templates/CreateReview";
import DishSearch from "../molecules/DishSearch";
import { useContext, useState } from "react";
import { BusinessContext } from "../../../../contexts/business.context";
// import MenuFilter from "../organisms/MenuFilter";

const MenuDetail = ({ menuData, isLoadingMenu, isErrorMenu, business_id }) => {
  const reviewData = useReviewByBusinessId(business_id);
  const { business } = useContext(BusinessContext);
  const isBusinessOwner =
    business.isAuthenticated && business.business.id == business_id;

  const [searchKeyword, setSearchKeyword] = useState("");

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

  const handleSearch = (keyword) => {
    setSearchKeyword(keyword);
  };

  return (
    <>
      <div style={styles.menuPage}>
        <Row>
          <Col xs={1} sm={2} md={0} lg={0} xl={1}></Col>
          <MenuProvider>
            <Col xs={22} sm={20} md={9} lg={6} xl={5}>
              <Row>
                <div style={{ padding: "13px 26px 0px", width: "100%" }}>
                  <p style={styles.titleMenu}>THỰC ĐƠN</p>
                </div>
              </Row>
              <Row style={{ position: "sticky", top: 70 }}>
                <div style={{ width: "100%" }}>
                  {menuData.length > 0 && (
                    <MenuList
                      menuData={menuData}
                      searchKeyword={searchKeyword}
                    ></MenuList>
                  )}
                  {isBusinessOwner && <AddMenu businessId={business_id} />}
                  {/* <MenuFilter /> */}
                </div>
              </Row>
            </Col>
            <Col xs={1} sm={2} md={0} lg={0} xl={0}></Col>
            <Col xs={0} sm={1} md={0} lg={0} xl={0}></Col>
            <Col xs={24} sm={22} md={15} lg={11} xl={10}>
              <Row>
                <div style={{ padding: "13px 26px 0px" }}>
                  <p style={styles.titleMenu}>MÓN ĂN</p>
                </div>
              </Row>
              <Row>
                <DishSearch onSearch={handleSearch} />
                <MenuDetailList
                  menuData={menuData}
                  capitalizeMenuName={capitalizeMenuName}
                  searchKeyword={searchKeyword}
                />
              </Row>
            </Col>
            <Col xs={0} sm={1} md={0} lg={0} xl={0}></Col>
          </MenuProvider>
          <Col xs={0} sm={1} md={0} lg={0} xl={0}></Col>
          <Col xs={24} sm={22} md={24} lg={7} xl={7}>
            <Row>
              <div style={{ padding: "13px 26px 0px" }}>
                <p style={styles.titleMenu}>ĐÁNH GIÁ</p>
              </div>
            </Row>
            <Row>
              <ReviewList
                reviewData={reviewData.reviewData}
                businessId={business_id}
              />
              {!isBusinessOwner && <CreateReview businessId={business_id} />}
            </Row>
          </Col>
          <Col xs={0} sm={1} md={0} lg={0} xl={1}></Col>
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
