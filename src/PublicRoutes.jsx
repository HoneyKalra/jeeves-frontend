import { Navigate } from "react-router-dom";

export default function PublicRoute({ children }) {
  const isAuthenticated = localStorage.getItem("optedIn") === "true";

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  return children;
}
