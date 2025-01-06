import React from "react";
import MainLogo from "../assets/images/logo-light.png";

const Loader = () => {
  return (
    <div className="custom-loader">
      {/* <div id="container">
    <label className="loading-title">Loading ...</label>
    <span className="loading-circle sp1">
      <span className="loading-circle sp2">
        <span className="loading-circle sp3"></span>
      </span>
    </span>
  </div> */}
      {/* <div className="loader"></div> */}
      <div className="coin">
        <span className="engraving">
          <img
            src={MainLogo}
            alt="img"
            style={{ width: "100px", height: "100px", objectFit: "contain" }}
          />
        </span>
      </div>
    </div>
  );
};

export default Loader;
