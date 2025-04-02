import { List, Button } from "antd";
import useDishByMenuId from "../../../dish/hooks/useDishByMenuId";
import DeleteDish from "../../../dish/components/templates/DeleteDish";
import { useContext, useState, useEffect } from "react";
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
  const [windowWidth, setWindowWidth] = useState(window.innerWidth); // Theo dõi chiều rộng màn hình
  const { business } = useContext(BusinessContext);
  const isBusinessOwner =
    business.isAuthenticated && business.business.id == businessId;
  const MAX_LENGTH = 150;
  const MAX_VISIBLE_DISHES = 4;

  // Theo dõi kích thước màn hình
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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

  // Điều kiện để thay đổi layout
  const isSmallScreen = windowWidth < 450;

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
                    flexDirection: isSmallScreen ? "column" : "row",
                    padding: 0,
                    boxSizing: "border-box",
                    width: "100%",
                    alignItems: isSmallScreen ? "stretch" : "center",
                  }}
                >
                  {/* Hàng 1: Ảnh, Tên (và Mô tả khi ≥ 450px), Giá, Nút */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      width: "100%",
                      flexWrap: isSmallScreen ? "wrap" : "nowrap",
                    }}
                  >
                    <div
                      style={{
                        maxWidth: isSmallScreen ? "70px" : "16.6667%",
                        minWidth: "70px",
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
                        flex: isSmallScreen
                          ? "1 1 40vw"
                          : `1 1 ${isBusinessOwner ? "65%" : "80%"}`, // Khi ≥ 450px, giữ tỷ lệ như code cũ
                        maxWidth: isSmallScreen
                          ? "40vw"
                          : `${isBusinessOwner ? "65%" : "80%"}`,
                        padding: "0 1.5vw",
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
                          whiteSpace: "normal",
                        }}
                      >
                        {dish.dish_name}
                      </div>
                      {/* Mô tả nằm cùng container với tên khi ≥ 450px */}
                      {!isSmallScreen && (
                        <div
                          style={{
                            textAlign: "justify",
                            overflowWrap: "break-word",
                            wordBreak: "break-word",
                            whiteSpace: "normal",
                          }}
                        >
                          {dish.dish_description.length > MAX_LENGTH &&
                          !isExpanded
                            ? dish.dish_description.slice(0, MAX_LENGTH) + "..."
                            : dish.dish_description}
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
                      )}
                    </div>
                    <div
                      style={{
                        flex: "0 0 95px",
                        minWidth: "80px",
                        boxSizing: "border-box",
                        display: "flex",
                        justifyContent: "flex-end",
                      }}
                    >
                      <div
                        style={{
                          fontSize: "16px",
                          color: "#0288D1",
                          fontWeight: "bold",
                          whiteSpace: "nowrap",
                          paddingRight: 4,
                        }}
                      >
                        {formatPrice(dish.dish_price)}đ
                      </div>
                    </div>
                    {isBusinessOwner && (
                      <div
                        style={{
                          flex: "0 0 auto",
                          minWidth: "60px",
                          boxSizing: "border-box",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            gap: 4,
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <UpdateDish
                            dishId={dish._id}
                            businessId={businessId}
                          />
                          <DeleteDish
                            dishName={dish.dish_name}
                            dishId={dish._id}
                            businessId={businessId}
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Hàng 2: Mô tả khi < 450px */}
                  {isSmallScreen && (
                    <div
                      style={{
                        padding: "8px 0 0 0",
                        boxSizing: "border-box",
                        width: "100%",
                      }}
                    >
                      <div
                        style={{
                          textAlign: "justify",
                          overflowWrap: "break-word",
                          wordBreak: "break-word",
                          whiteSpace: "normal",
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
                  )}
                </div>
                <div
                  style={{ borderTop: "1px solid #ddd", marginTop: 5 }}
                ></div>
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
