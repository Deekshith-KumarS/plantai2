import { Navigate } from "react-router-dom";

export default function AdminRoute({ children }) {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  // If not logged in, redirect to login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // If logged in but not an admin, redirect to access denied page
  if (!user.isAdmin) {
    return <Navigate to="/access-denied" replace />;
  }

  // If admin, render the component
  return children;
}
