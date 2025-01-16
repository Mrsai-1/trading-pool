import React from "react";
import ReactSpeedometer from "react-d3-speedometer";
// Import the icons
import binanceIcon from "../assets/images/binance-icon-2048x2048-eh77cmwj.png";
import bitgetIcon from "../assets/images/11092.png";

const SpeedOMeter = ({ title, balance, target }) => {

  const getIcon = (title) => {
    const lowerTitle = title.toLowerCase(); // Convert title to lowercase for case-insensitivity
    if (lowerTitle.includes("binance")) {
      return binanceIcon;
    } else if (lowerTitle.includes("bitget")) {
      return bitgetIcon;
    }
    return null;
  };

  const icon = getIcon(title);


  return (
    <>
      <div className="d-flex align-items-center justify-content-center gap-2 mb-2">
        {icon && (
          <img
            src={icon}
            alt={`${title} icon`}
            width={20}
            height={20}
            className="crypto-title-icon"
          />
        )}
        <p className="text-capitalize primary-color fw-bold fs-14 mb-0">{title}</p>
      </div>
      <ReactSpeedometer
        forceRender={true}
        value={balance}
        maxValue={25000}
        segments={5000}
        customSegmentStops={[0, 5000, 10000, 15000, 20000, 25000]}
        customSegmentLabels={[
          {
            text: "5K",
            position: "OUTSIDE",
            fontSize: "13px",
            color: "#1C526D",
          },
          {
            text: "10K",
            position: "OUTSIDE",
            fontSize: "13px",
            color: "#1C526D",
          },
          {
            text: "15K",
            position: "OUTSIDE",
            fontSize: "13px",
            color: "#1C526D",
          },
          {
            text: "20K",
            position: "OUTSIDE",
            fontSize: "13px",
            color: "#1C526D",
          },
          {
            text: "25K",
            position: "OUTSIDE",
            fontSize: "13px",
            color: "#1C526D",
          },
        ]}
        needleColor="#000"
        startColor="#1C526D"
        endColor="#7CDBF9"
        fluidWidth={false}
        height={180}
        width={250}
      />
      {/* <p className="text-center mt-2 mb-0 fs-14 text-muted">
        Target: <span className="primary-color">{target}K</span>
      </p> */}
    </>
  );
};

export default SpeedOMeter;
