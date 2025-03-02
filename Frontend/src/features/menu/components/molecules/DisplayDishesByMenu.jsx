import { List, Row, Col } from "antd";
import useDishByMenuId from "../../../dish/hooks/useDishByMenuId";

const DisplayDishesByMenu = ({ menuId }) => {
  const { dishData } = useDishByMenuId(menuId);

  //Hàm định dạng giá tiền
  const formatPrice = (price) => {
    return price.toLocaleString("vi-VN"); // Thêm dấu chấm ngăn cách hàng nghìn
  };

  return (
    <>
      <List
        grid={{ gutter: 16, column: 1 }}
        dataSource={dishData}
        renderItem={(dish) => (
          <List.Item>
            <Row style={{ padding: "5px" }}>
              <Col span={5}>
                <img
                  style={{ width: "60px", height: "60px" }}
                  src={dish.dish_url[0]}
                  alt="Ảnh"
                ></img>
              </Col>
              <Col span={14} style={{ padding: "0px 10px" }}>
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
                <Row>{dish.dish_description}</Row>
              </Col>
              <Col span={5}>
                <div
                  style={{
                    fontSize: "16px",
                    color: "#0288D1",
                    fontWeight: "bold",
                  }}
                >
                  {formatPrice(dish.dish_price)}đ
                </div>
              </Col>
            </Row>
            <hr style={{ height: "2px", border: "no", opacity: "0.2" }} />
          </List.Item>
        )}
      ></List>
    </>
  );
};

export default DisplayDishesByMenu;
