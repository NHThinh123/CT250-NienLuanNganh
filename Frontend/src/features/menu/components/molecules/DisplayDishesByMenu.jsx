import { List, Button } from "antd";
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
  const MAX_LENGTH = 150;
  const MAX_VISIBLE_DISHES = 4;

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const formatPrice = (price) => {
    return price.toLocaleString("vi-VN");
  };

  const filteredDishes = dishData.filter(
    (dish) =>
      removeAccents(dish.dish_name.toLowerCase()).includes(
        removeAccents(searchKeyword.toLowerCase())
      ) ||
      removeAccents(dish.dish_description.toLowerCase()).includes(
        removeAccents(searchKeyword.toLowerCase())
      )
  );

  const visibleDishes = showAllDishes
    ? filteredDishes
    : filteredDishes.slice(0, MAX_VISIBLE_DISHES);

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
              <List.Item style={{ paddingRight: 0, borderRadius: 8 }}>
                <div
                  style={{
                    display: "flex",
                    padding: 0,
                    boxSizing: "border-box",
                    width: "100%",
                  }}
                >
                  <div
                    style={{
                      flex: "0 0 16.6667%",
                      maxWidth: "16.6667%",
                      boxSizing: "border-box",
                    }}
                  >
                    <img
                      style={{
                        width: "70px",
                        height: "70px",
                        objectFit: "cover",
                      }}
                      src={dish.dish_url}
                      alt="Ảnh"
                    />
                  </div>
                  <div
                    style={{
                      flex: `0 0 ${isBusinessOwner ? "54.1667%" : "62.5%"}`,
                      maxWidth: `${isBusinessOwner ? "54.1667%" : "62.5%"}`,
                      padding: 0,
                      boxSizing: "border-box",
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "16px",
                        color: "#464646",
                        fontWeight: "bold",
                        overflowWrap: "break-word",
                        wordBreak: "break-word",
                      }}
                    >
                      {dish.dish_name}
                    </div>
                    <div>
                      <div
                        style={{
                          textAlign: "justify",
                          overflowWrap: "break-word",
                          wordBreak: "break-word",
                        }}
                      >
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
                  </div>
                  <div
                    style={{
                      flex: "0 0 20.8333%",
                      maxWidth: "20.8333%",
                      boxSizing: "border-box",
                    }}
                  >
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
                        overflow: "hidden",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {formatPrice(dish.dish_price)}đ
                    </div>
                  </div>
                  {isBusinessOwner && (
                    <div
                      style={{
                        flex: "0 0 8.3333%",
                        maxWidth: "8.3333%",
                        boxSizing: "border-box",
                      }}
                    >
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
                    </div>
                  )}
                </div>
                <hr
                  style={{
                    height: "2px",
                    border: "none",
                    opacity: "0.2",
                    marginTop: 6,
                    width: "100%",
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
            width: "100%",
            boxSizing: "border-box",
          }}
        >
          Chưa có món! Vui lòng nhấn vào nút <SquarePlus strokeWidth={1} /> để
          thêm!
        </div>
      )}
      {filteredDishes.length > MAX_VISIBLE_DISHES && (
        <div style={{ textAlign: "center", width: "100%" }}>
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
