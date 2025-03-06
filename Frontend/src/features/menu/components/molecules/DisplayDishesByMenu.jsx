import { List, Row, Col } from "antd";
import useDishByMenuId from "../../../dish/hooks/useDishByMenuId";
import DeleteDish from "../../../dish/components/templates/DeleteDish";
import { useState } from "react";

const DisplayDishesByMenu = ({ menuId }) => {
  const { dishData } = useDishByMenuId(menuId);
  const [isExpanded, setIsExpanded] = useState(false);
  const MAX_LENGTH = 150; // Giới hạn số ký tự ban đầu

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  //Hàm định dạng giá tiền
  const formatPrice = (price) => {
    return price.toLocaleString("vi-VN"); // Thêm dấu chấm ngăn cách hàng nghìn
  };

  return (
    <>
      {dishData.length > 0 ? (
        <List
          grid={{ gutter: 16, column: 1 }}
          dataSource={dishData}
          renderItem={(dish) => (
            <List.Item>
              <Row style={{ padding: 0 }}>
                <Col span={4}>
                  <img
                    style={{ width: "70px", height: "70px" }}
                    src={dish.dish_url[0]}
                    alt="Ảnh"
                  ></img>
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
                  <DeleteDish dishName={dish.dish_name} dishId={dish._id} />
                </Col>
              </Row>
              <hr style={{ height: "2px", border: "no", opacity: "0.2" }} />
            </List.Item>
          )}
        />
      ) : (
        <div
          style={{
            textAlign: "center",
            padding: "20px",
            fontSize: "16px",
            color: "#888",
          }}
        >
          Chưa có món!
        </div>
      )}
    </>
  );
};

export default DisplayDishesByMenu;
