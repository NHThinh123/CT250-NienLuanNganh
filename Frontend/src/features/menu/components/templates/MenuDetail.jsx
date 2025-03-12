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
          <Col span={2}></Col>
          <Col span={5}>
            <div style={{ padding: "13px 26px 0px" }}>
              <p style={styles.titleMenu}>THỰC ĐƠN</p>
            </div>
          </Col>
          <Col span={9}></Col>
          <Col span={8}>
            <div style={{ padding: "13px 26px 0px" }}>
              <p style={styles.titleMenu}>ĐÁNH GIÁ</p>
            </div>
          </Col>
          <Col span={2}></Col>
        </Row>
        <Row>
          <Col span={2}></Col>
          <MenuProvider>
            <Col span={5}>
              <div style={{ position: "sticky", top: 70 }}>
                {menuData.length > 0 && (
                  <MenuList
                    menuData={menuData}
                    searchKeyword={searchKeyword}
                  ></MenuList>
                )}
                {isBusinessOwner && <AddMenu businessId={business_id} />}
              </div>
            </Col>
            <Col span={9}>
              <div style={{ position: "sticky", top: 63.8, zIndex: 10 }}>
                <DishSearch onSearch={handleSearch} />
              </div>
              <MenuDetailList
                menuData={menuData}
                capitalizeMenuName={capitalizeMenuName}
                searchKeyword={searchKeyword}
              />
            </Col>
          </MenuProvider>
          <Col span={6}>
            <div
              style={{
                position: "sticky",
                top: 70,
              }}
            >
              <ReviewList reviewData={reviewData.reviewData} />
              {!isBusinessOwner && <CreateReview businessId={business_id} />}
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
