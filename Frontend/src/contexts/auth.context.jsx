import { createContext, useEffect, useState } from "react";

// Tạo Context với giá trị mặc định
export const AuthContext = createContext({
    isAuthenticated: false,
    user: {
        id: "",
        email: "",
        role: "",
        name: "",
        avatar: "",
        dateOfBirth: "",

    },
    setAuth: () => { },
    loading: true,
    setLoading: () => { },
});

// Provider quản lý trạng thái xác thực
export const AuthWrapper = ({ children }) => {
    const [auth, setAuth] = useState(() => {
        try {
            const storedUser = localStorage.getItem("authUser");
            const parsedUser = storedUser ? JSON.parse(storedUser) : null;
            return parsedUser
                ? { isAuthenticated: true, user: parsedUser }
                : { isAuthenticated: false, user: {} };
        } catch (error) {
            console.error("Lỗi khi parse localStorage:", error);
            localStorage.removeItem("authUser"); // Xóa dữ liệu lỗi để tránh lỗi lần sau
            return { isAuthenticated: false, user: {} };
        }
    });


    const [loading, setLoading] = useState(false);

    // Khi user đăng nhập, lưu vào localStorage
    useEffect(() => {
        if (auth.isAuthenticated) {
            localStorage.setItem("authUser", JSON.stringify(auth.user));
        } else {
            localStorage.removeItem("authUser");
        }
    }, [auth]);

    return (
        <AuthContext.Provider value={{ auth, setAuth, loading, setLoading }}>
            {children}
        </AuthContext.Provider>
    );
};
