import React from "react";
import { Link, useNavigate } from "react-router-dom";
import useFetchKeys from "./CotextTest";

const BinanceSpotTable = ({ data }) => {
  const navigate = useNavigate();
  const { getCoinicons } = useFetchKeys();

  const limitedData = data?.length > 3 ? data?.slice(0, 5) : data;



  return (
    <div className="table-responsive">
      <table className="table table-bordered text-center mb-0">
        <thead className="thead primary-bg">
          <tr>
            <th>
              <p className="mb-0 primary-color fs-14">Symbol</p>
            </th>
            <th>
              <p className="mb-0 primary-color fs-14">Price</p>
            </th>
            <th>
              <p className="mb-0 primary-color fs-14">OrigQty</p>
            </th>
          </tr>
        </thead>
        <tbody className="tbody">
          {limitedData?.length > 0 ? (
            limitedData?.map((data, index) => (
              <tr key={index}>
                <td>
                  <div className="d-flex gap-2 align-items-center justify-content-center">
                    {/* <p className="mb-0 table-dot"></p> */}
                    <img
                      src={getCoinicons(data?.symbol)}
                      alt={data?.name}
                      className="cryptocurreny-icon-table crypto-icon"
                      width={25}
                    />
                    <p className="mb-0 fs-13 fw-semibold">
                      {data?.symbol || "NA"}
                    </p>
                    {/* <p>{getFormattedDate(data.updateTime)}</p> */}
                  </div>
                </td>
                <td>
                  <p className="mb-0 fs-13 fw-semibold">
                    {parseFloat(data?.price)}
                  </p>
                </td>
                <td>
                  <p className="mb-0 fs-13 fw-semibold">
                    {data?.origQty}
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
            <td colSpan={3} className="text-center">
              <div
                onClick={() => {
                  navigate("/allDataTable", {
                    state: { reduxName: "binanceSpot", type: "AMM" , platform: "BINANCE" },
                  });
                }}
              >
                <button className="py-1">view all</button>
              </div>
            </td>
          </tr> */}

          <tr>
            <td colSpan={3} className="text-center">
              <div
                onClick={() => {
                  // Store the necessary data in local storage
                  const dataToStore = {
                    reduxName: "binanceSpot",
                    type: "AMM",
                    platform: "BINANCE",
                    extraReduxName: "bitgetSpot",
                    extraPlatform: "BITGET",
                  };
                  localStorage.setItem("allDataTableParams", JSON.stringify(dataToStore));

                  // Navigate to the route without query parameters
                  navigate("/allDataTable");
                }}
              >
                <button className="py-1">View All</button>
              </div>
            </td>
          </tr>

        </tbody>
      </table>
    </div>
  );
};

export default BinanceSpotTable;
