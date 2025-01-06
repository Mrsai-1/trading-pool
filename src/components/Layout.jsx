import React from "react";
import Header from "./Header";
import { Outlet } from "react-router-dom";
import { getJwt } from "../services/mainService";
import Footer from "./Footer";

const Layout = () => {
  const protectedRoute = () => {
    const jwt = getJwt();
    if (!jwt) {
      return window.location("/");
    }
  };

  return (
    <>
      <Header />
      <main className="container-fluid">
        <Outlet />
      </main>
      <Footer />
    </>
  );
};

export default Layout;
