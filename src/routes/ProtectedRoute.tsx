import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
  children: JSX.Element;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const access = localStorage.getItem("access");
  const user = localStorage.getItem("user");

  if (!access || !user) {
    // Not authenticated → redirect to /auth
    return <Navigate to="/auth" replace />;
  }

  try {
    // Optional: Check if JWT is expired
    const payload = JSON.parse(atob(access.split(".")[1]));
    const isExpired = payload.exp * 1000 < Date.now();

    if (isExpired) {
      localStorage.clear();
      return <Navigate to="/auth" replace />;
    }
  } catch (err) {
    localStorage.clear();
    return <Navigate to="/auth" replace />;
  }

  return children;
};

export default ProtectedRoute;
