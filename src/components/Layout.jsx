import React,{useState} from "react";
import Header from "./Header";
import { Outlet } from "react-router-dom";
import { getJwt } from "../services/mainService";
import Footer from "./Footer";

const Layout = () => {
  const [isDark, setIsDark] = useState(false); // State to track dark mode
  const protectedRoute = () => {
    const jwt = getJwt();
    if (!jwt) {
      return window.location("/");
    }
  };

  const handleTheme = () => {
    setIsDark(!isDark); // Toggle dark mode state
    document.body.classList.toggle("dark"); // Toggle dark class on the body
  };
  return (
    <>
      <Header isDark={isDark}/>
      <main className="container-fluid mb-5 pb-3 mb-sm-0 pb-sm-0">
        <Outlet />
        <div
          className="theme-toggle rounded-circle position-absolute d-inline-flex justify-content-center align-items-center"
          onClick={handleTheme}
        >
          {/* Change icon based on theme */}
          <i
            className={`ri-${isDark ? "sun" : "moon"}-line text-white fs-4 transition-all`}
            style={{
              transition: "transform 0.3s ease", // Add transition effect
              transform: isDark ? "rotate(180deg)" : "rotate(0deg)", // Rotate the icon when toggled
            }}
          ></i>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default Layout;
