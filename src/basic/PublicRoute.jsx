import React from "react";
import { Navigate } from "react-router-dom";
import { getJwt } from "../services/mainService"; // Function to fetch JWT

const PublicRoute = ({ children }) => {
  const jwt = getJwt();

  // Redirect to dashboard if JWT exists
  if (jwt) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default PublicRoute;
