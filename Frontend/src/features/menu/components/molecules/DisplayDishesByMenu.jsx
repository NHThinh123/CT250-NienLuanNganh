import { List, Row, Col, Button } from "antd";
import useDishByMenuId from "../../../dish/hooks/useDishByMenuId";
import DeleteDish from "../../../dish/components/templates/DeleteDish";
import { useState } from "react";
import { SquarePlus } from "lucide-react";
// import UpdateDish from "./UpdateDish";

const DisplayDishesByMenu = ({ menuId, businessId }) => {
  const { dishData } = useDishByMenuId(menuId);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showAllDishes, setShowAllDishes] = useState(false);
  const MAX_LENGTH = 150; // Giới hạn số ký tự mô tả
  const MAX_VISIBLE_DISHES = 4; // Giới hạn số món ăn hiển thị ban đầu

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  // Hàm định dạng giá tiền
  const formatPrice = (price) => {
    return price.toLocaleString("vi-VN");
  };

  // Danh sách món ăn hiển thị
  const visibleDishes = showAllDishes
    ? dishData
    : dishData.slice(0, MAX_VISIBLE_DISHES);

  return (
    <>
      {dishData.length > 0 ? (
        <>
          <List
            grid={{ gutter: 16, column: 1 }}
            dataSource={visibleDishes}
            renderItem={(dish) => (
              <List.Item styles={{ paddingRight: 0 }}>
                <Row style={{ padding: 0 }}>
                  <Col span={4}>
                    <img
                      style={{ width: "70px", height: "70px" }}
                      src={dish.dish_url[0]}
                      alt="Ảnh"
                    />
                  </Col>
                  <Col span={14} style={{ padding: 0 }}>
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
                  <Col span={5}>
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
                  <Col span={1}>
                    <div
                      style={{
                        display: "grid",
                        placeItems: "center",
                        height: "100%",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: 7, // Khoảng cách giữa các nút
                          alignItems: "center",
                        }}
                      >
                        {/* <UpdateDish dishId={dish._id} businessId={businessId} /> */}
                        <DeleteDish
                          dishName={dish.dish_name}
                          dishId={dish._id}
                          businessId={businessId}
                        />
                      </div>
                    </div>
                  </Col>
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
          {dishData.length > MAX_VISIBLE_DISHES && (
            <div style={{ textAlign: "center", marginTop: "10px" }}>
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
    </>
  );
};

export default DisplayDishesByMenu;
