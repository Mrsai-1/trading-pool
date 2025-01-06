import React from "react";
import { Navigate } from "react-router-dom";
import { getJwt } from "../services/mainService"; // Function to fetch JWT

const ProtectedRoute = ({ children }) => {
  const jwt = getJwt();

  // Redirect to login if JWT does not exist
  if (!jwt) {
    return <Navigate to="/" replace />;
  }
 

  return children;
};

export default ProtectedRoute;
