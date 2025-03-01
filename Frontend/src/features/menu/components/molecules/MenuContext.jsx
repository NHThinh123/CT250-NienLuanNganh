import { createContext, useRef, useEffect } from "react";

// eslint-disable-next-line react-refresh/only-export-components
export const MenuContext = createContext();

export const MenuProvider = ({ children }) => {
  const menuRefs = useRef({}); // Luôn là một object hợp lệ

  // Cập nhật menuRefs với các phần tử DOM thực tế
  useEffect(() => {
    const menuElements = document.querySelectorAll("[data-menu-id]");
    menuElements.forEach((element) => {
      menuRefs.current[element.getAttribute("data-menu-id")] = element;
    });
  }, [children]); // Cập nhật khi children thay đổi

  // Hàm xử lý cuộn đến menu
  const handleMenuClick = (menuId) => {
    const element = menuRefs.current?.[menuId]; // Kiểm tra tồn tại
    if (element) {
      const offsetTop =
        element.getBoundingClientRect().top + window.scrollY - 50;
      window.scrollTo({ top: offsetTop, behavior: "smooth" });
    }
  };

  return (
    <MenuContext.Provider value={{ menuRefs, handleMenuClick }}>
      {children}
    </MenuContext.Provider>
  );
};
