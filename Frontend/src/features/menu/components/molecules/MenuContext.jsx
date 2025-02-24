import { createContext, useRef } from "react";

// eslint-disable-next-line react-refresh/only-export-components
export const MenuContext = createContext();

export const MenuProvider = ({ children }) => {
  const menuRefs = useRef({});

  // Hàm xử lý cuộn đến menu
  const handleMenuClick = (menuId) => {
    const element = menuRefs.current[menuId];
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
