import React, { useState, Suspense } from "react";
import {  useSelector } from "react-redux";
import SpeedOMeter from "../common/SpeedOMeter";
import MiniLoader from "../common/MiniLoader";
import { useLocation } from "react-router-dom";

// const BinanceSpotBot = React.lazy(() => import("./bots-table/BinanceSpotBot"));
// const BinanceFutureBot = React.lazy(() => import("./bots-table/BinanceFutureBot"));
// const BitgitSpotBot = React.lazy(() => import("./bots-table/BitgitSpotBot"));
// const BitgitFutureBot = React.lazy(() => import("./bots-table/BitgitFuture"));


import BinanceSpotBot from "./bots-table/BinanceSpotBot";
import BinanceFutureBot from "./bots-table/BinanceFutureBot";
import BitgitSpotBot from "./bots-table/BitgitSpotBot";
import BitgitFutureBot from "./bots-table/BitgitFuture";

const Dashboard = () => {
  const location = useLocation();

  const { type, platform } = location.state || {};


  const [activeFutureBot, setActiveFutureBot] = useState(
    type === "FUTURES" ? platform : "BINANCE"
  );
  const [activeSpotBot, setActiveSpotBot] = useState(
    type === "AMM" ? platform : "BINANCE"
  );


  const binanceFuture = useSelector((state) => state?.binanceFuture?.value);
  const binanceSpot = useSelector((state) => state?.binanceSpot?.value);
  const BitgetFuture = useSelector((state) => state?.bitgetFuture?.value);
  const BitgetSpot = useSelector((state) => state?.bitgetSpot?.value);

  

  return (
    <>
      <div className="bots-table">
        <div className="row row-gap-2 pb-2 d-none d-md-flex">
          <div className="col-xl-3 col-lg-3 col-md-6 col-sm-6 col-12">
            <div className="card">
              <div className="card-body text-center p-1">
                <SpeedOMeter
                  title="binance SPOT balance"
                  balance={binanceSpot?.totalBalance ? JSON.parse(binanceSpot.totalBalance) : 0}
                  target={10000}
                />
              </div>
            </div>
          </div>


          <div className="col-xl-3 col-lg-3 col-md-6 col-sm-6 col-12">
            <div className="card">


              <div className="card-body text-center p-1">
                <SpeedOMeter
                  title="bitget SPOT balance"
                  balance={BitgetSpot?.totalBalance ? JSON.parse(BitgetSpot?.totalBalance) :  0}
                  target={10000}
                />
              </div>

            </div>
          </div>

          <div className="col-xl-3 col-lg-3 col-md-6 col-sm-6 col-12">
            <div className="card">
              <div className="card-body text-center p-1">
                <SpeedOMeter
                  title="binance FUTURE balance"
                  balance={binanceFuture?.usdt_balance?.availableBalance ? JSON.parse(binanceFuture?.usdt_balance?.availableBalance) : 0}
                  target={10000}
                />
              </div>
            </div>
          </div>

          <div className="col-xl-3 col-lg-3 col-md-6 col-sm-6 col-12">
            <div className="card">
              <div className="card-body text-center p-1">
                <SpeedOMeter
                  title="bitget FUTURE balance"
                  balance={BitgetFuture?.usdt_balance?.availableBalance ? JSON.parse(BitgetFuture?.usdt_balance?.availableBalance) : 0}
                  target={10000}
                />
              </div>
            </div>
          </div>
        </div>


        <div className="row row-gap-2 bots-table-row">
          {/* SPOT BOT SECTION */}
          <div className="col-xl-6 col-lg-6 col-md-12 mb-3">
            <div className="card ">
              <div className="card-body ">
                <div className="the-bots d-flex gap-2 mb-2">
                  <div
                    className={`binance-spot-bot flex-fill text-center p-2 ${activeSpotBot === "BINANCE" ? "active" : ""
                      }`}
                    onClick={() => setActiveSpotBot("BINANCE")}
                  >
                    <p className="mb-0 text-capitalize fs-14 fw-semibold">
                      binance SPOT bot
                    </p>
                  </div>
                  <div
                    className={`binance-spot-bot flex-fill text-center p-2 ${activeSpotBot === "BITGET" ? "active" : ""
                      }`}
                    onClick={() => setActiveSpotBot("BITGET")}
                  >
                    <p className="mb-0 text-capitalize fs-14 fw-semibold">
                      bitget SPOT bot
                    </p>
                  </div>
                </div>
                {/* <Suspense
                  fallback={
                    <div>
                      <MiniLoader />
                    </div>
                  }
                > */}
                  {activeSpotBot === "BINANCE" ? <BinanceSpotBot /> : <BitgitSpotBot />}
                  {/* {activeSpotBot === "BITGET" && <BitgitSpotBot />} */}


                {/* </Suspense> */}
              </div>
            </div>
          </div>

          {/* FUTURES BOT SECTION */}
          <div className="col-xl-6 col-lg-6 col-md-12 mb-3">
            <div className="card">
              <div className="card-body ">
                <div className="the-bots d-flex gap-2 mb-2">
                  <div
                    className={`binance-spot-bot flex-fill text-center p-2 ${activeFutureBot === "BINANCE" ? "active" : ""
                      }`}
                    onClick={() => setActiveFutureBot("BINANCE")}
                  >
                    <p className="mb-0 text-capitalize fs-14 fw-semibold">
                      binance FUTURES bot
                    </p>
                  </div>
                  <div
                    className={`binance-spot-bot flex-fill text-center p-2 ${activeFutureBot === "BITGET" ? "active" : ""
                      }`}
                    onClick={() => setActiveFutureBot("BITGET")}
                  >
                    <p className="mb-0 text-capitalize fs-14 fw-semibold">
                      bitget FUTURES bot
                    </p>
                  </div>
                </div>
                {/* <Suspense
                  fallback={
                    <div>
                      <MiniLoader />
                    </div>
                  }
                > */}
                  {activeFutureBot === "BINANCE" ? <BinanceFutureBot /> : <BitgitFutureBot />}
                  {/* {activeFutureBot === "BITGET" && <BitgitFutureBot/>} */}


                {/* </Suspense> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
