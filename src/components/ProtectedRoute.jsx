import React from "react";
import { Navigate } from "react-router-dom";

function ProtectedRoute({ children }) {
  // We check if the user has a "token" (their VIP pass) saved in their browser.
  const isAuthenticated = localStorage.getItem("userToken");

  // IF NO VIP PASS: Kick them straight to the Login page.
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // IF THEY HAVE THE PASS: Open the doors and let them see the page!
  return children;
}

export default ProtectedRoute;