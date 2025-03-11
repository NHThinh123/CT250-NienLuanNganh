import { Navigate, Outlet } from "react-router-dom";
import { useAuthEntity } from "../../hooks/useAuthEntry";

const ProtectedRoute = ({ children, redirectPath = "/login" }) => {
  const { entity } = useAuthEntity();

  // Kiểm tra xem có user hoặc business đăng nhập không

  if (!entity.id) {
    // Nếu không đăng nhập, chuyển hướng đến redirectPath
    return <Navigate to={redirectPath} replace />;
  }

  // Nếu đã đăng nhập, render children hoặc Outlet (cho nested routes)
  return children ? children : <Outlet />;
};

export default ProtectedRoute;
