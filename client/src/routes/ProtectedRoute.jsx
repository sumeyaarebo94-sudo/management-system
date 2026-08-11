import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location }}
      />
    );
  }

  if (
    allowedRoles &&
    !allowedRoles.includes(user?.role)
  ) {
    return (
      <div
        style={{
          padding: "40px",
          textAlign: "center",
        }}
      >
        <h1>Access Denied</h1>
        <p>
          You do not have permission to access this page.
        </p>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;
