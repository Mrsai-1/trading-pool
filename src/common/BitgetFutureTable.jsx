import React from "react";
import { Link, useNavigate } from "react-router-dom";
import useFetchKeys from "./CotextTest";
import BuysellFutureModal from "../components/models/BuysellFutureModal";

const BitgetFutureTable = ({ data }) => {
  const { getCoinicons, getFormattedDate } = useFetchKeys();

  const limitedData = data?.length > 3 ? data?.slice(0, 5) : data;


  const navigate = useNavigate();

  return (
    <>
      <div className="table-responsive bots-table-area mb-2">
        <table className="table table-bordered text-center mb-0 align-middle custom-border">
          <thead className="thead">
            <tr>
              <th>
                <p className="mb-0 fs-14">Symbol</p>
              </th>
              <th>
                <p className="mb-0 fs-14">Profit</p>
              </th>
              <th>
                <p className="mb-0 fs-14">PositionAmt</p>
              </th>
            </tr>
          </thead>
          <tbody className="tbody fx-white">
            {limitedData?.length > 0 ? (
              limitedData?.map((data, index) => (
                <tr key={index}>
                  <td>
                    <div className="d-flex gap-2 align-items-center justify-content-center">
                      <img
                        src={getCoinicons(data.symbol)}
                        alt={data.name}
                        className="cryptocurreny-icon-table crypto-icon"
                        width={25}
                      />
                      <p className="mb-0 fs-13 fw-semibold">
                        {data?.symbol || "NA"}
                      </p>
                    </div>
                  </td>
                  <td>
                    <p className={`mb-0 fs-13 fw-semibold lh-2 ${data.unRealizedProfit > 0 ? " text-success" : " text-danger"}`}>
                      {parseFloat(data.unRealizedProfit || 0)}
                    </p>
                  </td>
                  <td>
                    <p className="mb-0 fs-13 fw-semibold">
                      {parseFloat(data.positionAmt || 0)}
                    </p>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={3}>
                  <p className="text-center">No Data Found</p>
                </td>
              </tr>
            )}

            {/* <tr>
            <td colSpan={5} className="text-center">
              <div
                onClick={() => {
                  navigate("/allDataTable", {
                    state: { reduxName: "bitgetFuture", type: "FUTURES" , platform: "BITGET" },
                  });
                }}
              >
                <button className="py-1">view all</button>
              </div>
            </td>
          </tr> */}

            {/* <tr>
              <td colSpan={3} className="text-center">
                <div
                  onClick={() => {
                    // Define the data to store in localStorage
                    const dataToStore = {
                      reduxName: "bitgetFuture",
                      type: "FUTURES",
                      platform: "BITGET",
                      extraReduxName: "binanceFuture",
                      extraPlatform: "BINANCE",
                    };

                    // Store the data in localStorage
                    localStorage.setItem("allDataTableParams", JSON.stringify(dataToStore));

                    // Navigate to the route without query params
                    navigate("/allDataTable");
                  }}
                >
                  <button className="py-1">View All</button>
                </div>

              </td>
            </tr> */}

          </tbody>
        </table>


      </div>
      <div className="d-flex justify-content-between align-items-center">
        <div
          onClick={() => {
            // Define the data to store in localStorage
            const dataToStore = {
              reduxName: "bitgetFuture",
              type: "FUTURES",
              platform: "BITGET",
              extraReduxName: "binanceFuture",
              extraPlatform: "BINANCE",
            };

            // Store the data in localStorage
            localStorage.setItem("allDataTableParams", JSON.stringify(dataToStore));

            // Navigate to the route without query params
            navigate("/allDataTable");
          }}
        >
          <button className="py-1">View All</button>
        </div>

        <div className="text-end">
          <button
            className="py-1"
            data-bs-toggle="modal"
            data-bs-target="#buysellfuturemodal"
          >
            Buy / Sell
          </button>
        </div>
      </div>
      <BuysellFutureModal />
    </>
  );
};

export default BitgetFutureTable;
