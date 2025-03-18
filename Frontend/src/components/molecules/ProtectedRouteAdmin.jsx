import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../contexts/auth.context";

const ProtectedRoute = ({ children, redirectPath = "/login", requiredRole }) => {
    const { auth } = useContext(AuthContext);

    if (!auth.isAuthenticated) {
        return <Navigate to={redirectPath} replace />;
    }

    if (requiredRole && auth.user.role !== requiredRole) {
        return <Navigate to="/unauthorized" replace />;
    }

    return children;
};

export default ProtectedRoute;