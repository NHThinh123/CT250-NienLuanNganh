import { createContext, useEffect, useState } from "react";

// Tạo Context cho Business
export const BusinessContext = createContext({
  isAuthenticated: false,
  business: {
    id: "",
    business_name: "",
    email: "",
    contact_info: "",
    location: "",
    avatar:
      "https://res.cloudinary.com/nienluan/image/upload/v1741245839/Business_Avatar_Default_jkhjhf.jpg",
    open_hours: "",
    close_hours: "",
  },
  setBusiness: () => {},
  loading: true,
  setLoading: () => {},
});

// Provider quản lý trạng thái Business
export const BusinessWrapper = ({ children }) => {
  const [business, setBusiness] = useState(() => {
    try {
      const storedBusiness = localStorage.getItem("authBusiness");
      console.log(
        "Dữ liệu từ localStorage trong BusinessWrapper:",
        localStorage.getItem("authBusiness")
      );
      const parsedBusiness = storedBusiness ? JSON.parse(storedBusiness) : null;
      if (parsedBusiness && parsedBusiness.isAuthenticated) {
        return {
          ...parsedBusiness,
          business: {
            ...parsedBusiness.business,
            avatar:
              parsedBusiness.business.avatar ||
              "https://res.cloudinary.com/nienluan/image/upload/v1741245839/Business_Avatar_Default_jkhjhf.jpg",
          },
        };
      }
      return {
        isAuthenticated: false,
        business: {
          avatar:
            "https://res.cloudinary.com/nienluan/image/upload/v1741245839/Business_Avatar_Default_jkhjhf.jpg",
        },
      };
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu từ localStorage:", error);
      localStorage.removeItem("authBusiness");
      return {
        isAuthenticated: false,
        business: {
          avatar:
            "https://res.cloudinary.com/nienluan/image/upload/v1741245839/Business_Avatar_Default_jkhjhf.jpg",
        },
      };
    }
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (business.isAuthenticated) {
      localStorage.setItem("authBusiness", JSON.stringify(business));
    } else {
      localStorage.removeItem("authBusiness");
    }
  }, [business]);

  return (
    <BusinessContext.Provider
      value={{ business, setBusiness, loading, setLoading }}
    >
      {children}
    </BusinessContext.Provider>
  );
};
