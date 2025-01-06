import React, { useEffect, useState } from "react";
import { AiFillApi, AiFillControl } from "react-icons/ai";
import { FaBitcoin } from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";
import { IoHome } from "react-icons/io5";

const Footer = () => {
  const [footerActive, setFooterActive] = useState(0);
  const location = useLocation();

  const footerLinks = [
    {
      id: 0,
      path: "/dashboard",
      itemName: "Home",
      icon: <IoHome size={17} />,
    },
    {
      id: 1,
      path: "/allDataTable",
      itemName: "AMM Bot",
      icon: <AiFillApi size={17} />,
      onClick: () => {
        // Store data in localStorage for API
        const dataToStore = {
          reduxName: "binanceSpot",
          type: "AMM",
          platform: "BINANCE",
          extraReduxName: "bitgetSpot",
          extraPlatform: "BITGET",
        };
        localStorage.setItem("allDataTableParams", JSON.stringify(dataToStore));
      },
    },
    {
      id: 2,
      path: "/allDataTable",
      itemName: "FUTURES Bot",
      icon: <FaBitcoin size={17} />,
      onClick: () => {
        // Store data in localStorage for Add Coins
        const dataToStore = {
          reduxName: "binanceFuture",
          type: "FUTURES",
          platform: "BINANCE",
          extraReduxName: "bitgetFuture",
          extraPlatform: "BITGET",
        };
        localStorage.setItem("allDataTableParams", JSON.stringify(dataToStore));
      },
    },
    {
      id: 3,
      path: "/controls",
      itemName: "Controls",
      icon: <AiFillControl size={17} />,
    },
  ];

  const handleFooterActive = (activeIndex) => {
    setFooterActive(activeIndex);
    const link = footerLinks[activeIndex];
    if (link.onClick) {
      link.onClick();
    }
  };

  // useEffect(() => {
  //   const currentPath = location.pathname;
  //   const activeIndex = footerLinks.findIndex((link) => link.path === currentPath);
  //   setFooterActive(activeIndex >= 0 ? activeIndex : 0);
  // }, [location]);

  return (
    <div className="footer position-fixed w-100 bottom-0 bg-dark text-white p-2 d-block d-lg-none">
      <div className="d-flex justify-content-between align-items-center">
        {footerLinks.map((item, index) => (
          <Link
            key={index}
            to={item.path}
            className={`footer-link text-secondary p-2 d-flex justify-content-center align-items-center flex-fill ${footerActive === index && "active"
              }`}
            onClick={() => handleFooterActive(index)}
          >
            <span className="me-2">{item.icon}</span>
            <span className="fs-14 fw-semibold d-none d-md-inline">
              {item.itemName}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Footer;
