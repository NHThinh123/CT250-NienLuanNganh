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
        avatar: "",
        open_hours: "",
        close_hours: "",
    },
    setBusiness: () => { },
    loading: true,
    setLoading: () => { },
});

// Provider quản lý trạng thái Business
export const BusinessWrapper = ({ children }) => {
    const [business, setBusiness] = useState(() => {
        try {
            const storedBusiness = localStorage.getItem("authBusiness");
            console.log("Dữ liệu từ localStorage trong BusinessWrapper:", localStorage.getItem("authBusiness"));
            const parsedBusiness = storedBusiness ? JSON.parse(storedBusiness) : null;
            return parsedBusiness && parsedBusiness.isAuthenticated
                ? parsedBusiness
                : { isAuthenticated: false, business: {} };
        } catch (error) {
            localStorage.removeItem("authBusiness");
            return { isAuthenticated: false, business: {} };
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
        <BusinessContext.Provider value={{ business, setBusiness, loading, setLoading }}>
            {children}
        </BusinessContext.Provider>
    );

};
