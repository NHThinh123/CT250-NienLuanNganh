import { List, Row, Col, Button } from "antd";
import useDishByMenuId from "../../../dish/hooks/useDishByMenuId";
import DeleteDish from "../../../dish/components/templates/DeleteDish";
import { useContext, useState } from "react";
import { SquarePlus } from "lucide-react";
import UpdateDish from "./UpdateDish";
import { BusinessContext } from "../../../../contexts/business.context";

const removeAccents = (str) => {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D");
};

const DisplayDishesByMenu = ({ menuId, businessId, searchKeyword }) => {
  const { dishData } = useDishByMenuId(menuId);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showAllDishes, setShowAllDishes] = useState(false);
  const { business } = useContext(BusinessContext);
  const isBusinessOwner =
    business.isAuthenticated && business.business.id == businessId;
  const MAX_LENGTH = 150; // Giới hạn số ký tự mô tả
  const MAX_VISIBLE_DISHES = 4; // Giới hạn số món ăn hiển thị ban đầu

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  // Hàm định dạng giá tiền
  const formatPrice = (price) => {
    return price.toLocaleString("vi-VN");
  };

  // Lọc món ăn dựa trên từ khóa tìm kiếm không dấu
  const filteredDishes = dishData.filter(
    (dish) =>
      removeAccents(dish.dish_name.toLowerCase()).includes(
        removeAccents(searchKeyword.toLowerCase())
      ) ||
      removeAccents(dish.dish_description.toLowerCase()).includes(
        removeAccents(searchKeyword.toLowerCase())
      )
  );

  // Danh sách món ăn hiển thị
  const visibleDishes = showAllDishes
    ? filteredDishes
    : filteredDishes.slice(0, MAX_VISIBLE_DISHES);

  // Nếu không có món ăn nào khớp với từ khóa tìm kiếm, không hiển thị menu
  if (filteredDishes.length === 0) {
    return null;
  }

  return (
    <>
      {dishData.length > 0 ? (
        <>
          <List
            grid={{ gutter: 16, column: 1 }}
            dataSource={visibleDishes}
            renderItem={(dish) => (
              <List.Item styles={{ paddingRight: 0, boderRadius: 8 }}>
                <Row style={{ padding: 0 }}>
                  <Col span={4}>
                    <img
                      style={{ width: "70px", height: "70px" }}
                      src={dish.dish_url}
                      alt="Ảnh"
                    />
                  </Col>
                  <Col span={isBusinessOwner ? 13 : 15} style={{ padding: 0 }}>
                    <Row>
                      <div
                        style={{
                          fontSize: "16px",
                          color: "#464646",
                          fontWeight: "bold",
                        }}
                      >
                        {dish.dish_name}
                      </div>
                    </Row>
                    <Row>
                      <div>
                        <div style={{ textAlign: "justify" }}>
                          {dish.dish_description.length > MAX_LENGTH &&
                          !isExpanded
                            ? dish.dish_description.slice(0, MAX_LENGTH) + "..."
                            : dish.dish_description}
                        </div>
                        {dish.dish_description.length > MAX_LENGTH && (
                          <button
                            onClick={toggleExpand}
                            style={{
                              color: "blue",
                              cursor: "pointer",
                              border: "none",
                              background: "none",
                              padding: 0,
                            }}
                          >
                            {isExpanded ? "Ẩn bớt" : "Xem thêm"}
                          </button>
                        )}
                      </div>
                    </Row>
                  </Col>
                  <Col span={isBusinessOwner ? 5 : 5}>
                    <div
                      style={{
                        fontSize: "16px",
                        color: "#0288D1",
                        fontWeight: "bold",
                        display: "grid",
                        placeItems: "center",
                        justifyContent: "flex-end",
                        height: "100%",
                        width: "100%",
                        paddingRight: 8,
                      }}
                    >
                      {formatPrice(dish.dish_price)}đ
                    </div>
                  </Col>
                  {isBusinessOwner && (
                    <Col span={2}>
                      <div
                        style={{
                          display: "grid",
                          placeItems: "center",
                          height: "100%",
                          width: "100%",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            gap: 4,
                            alignItems: "center",
                          }}
                        >
                          <div>
                            <UpdateDish
                              dishId={dish._id}
                              businessId={businessId}
                            />
                          </div>
                          <DeleteDish
                            dishName={dish.dish_name}
                            dishId={dish._id}
                            businessId={businessId}
                          />
                        </div>
                      </div>
                    </Col>
                  )}
                </Row>
                <hr
                  style={{
                    height: "2px",
                    border: "no",
                    opacity: "0.2",
                    marginTop: 6,
                  }}
                />
              </List.Item>
            )}
          />
        </>
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
          Chưa có món! Vui lòng nhấn vào nút <SquarePlus strokeWidth={1} /> để
          thêm!
        </div>
      )}
      {filteredDishes.length > MAX_VISIBLE_DISHES && (
        <div style={{ textAlign: "center" }}>
          <Button
            type="link"
            onClick={() => setShowAllDishes(!showAllDishes)}
            style={{ fontSize: "14px", color: "#1890ff" }}
          >
            {showAllDishes ? "Ẩn bớt món" : "Xem thêm món..."}
          </Button>
        </div>
      )}
    </>
  );
};

export default DisplayDishesByMenu;
