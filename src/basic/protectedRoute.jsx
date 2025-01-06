import React from 'react';
import { Navigate, useLocation, Outlet } from 'react-router-dom';
import { getCurrentUser } from '../services/auth/login/userService';

const ProtectedRoute = ({ path, element: Element, render, ...rest }) => {
  let location = useLocation();
  var user = getCurrentUser();
  if (!user) {
    return (
      <Navigate
        to={{
          pathname: '/login',
          state: { from: location },
        }}
        replace
      />
    );
  } else {
    return <Outlet />;
  }
};

export default ProtectedRoute;
