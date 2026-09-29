import { Navigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";

const AdminRoutes = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <h3>Loading...</h3>;
  }

  if (!user) {
    return <Navigate to="/admin-login" replace />;
  }

  if (user.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default AdminRoutes;
