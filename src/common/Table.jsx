import React, { useState,useEffect } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import useFetchKeys from "./CotextTest";
import Buysellfuturemodal from "../components/models/BuysellFutureModal";
import AutoProfitCloseModal from "../components/models/AutoProfitCloseModal";

const Table = ({ data, thead }) => {
  const navigate = useNavigate();
const [current_pair , setCurrent_pair] = useState(null);
    const [fetchedPrice, setFetchedPrice] = useState(null);

  const { getCoinicons, formatToExactDecimals,getValuepp } = useFetchKeys();

  const limitedData = data?.length > 3 ? data?.slice(0, 5) : data;

    const getTargetPrices = async () => {
          try {
              // Guard clause for empty sortedData
              if (limitedData.length === 0) {
                  return;
              }
  
              const fetchedPrices = [];
              for (let i = 0; i < limitedData.length; i++) {
                  const { data } = await getValuepp(limitedData[i].symbol);
                  fetchedPrices.push({
                      pair: limitedData[i],
                      price: parseFloat(data.price).toFixed(3),
                      // targ: newour_target_price,
                  });
                  setFetchedPrice(fetchedPrices);
                  // Wait for 1 second before the next API call
                  await new Promise((resolve) => setTimeout(resolve, 1000));
              }
          } catch (error) {
              console.log(error, "error");
          }
      };
  
      useEffect(() => {
          if (data) {
              getTargetPrices();
          }
      }, [data]);

  return (
    <>
      <div className="table-responsive bots-table-area">
        <table className="table table-bordered text-center mb-0">
          <thead className="thead primary-bg">
            <tr>
              {thead.map((head, i) => (
                <th key={i}>
                  <p className="mb-0 primary-color fs-14">{head}</p>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="tbody">
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
                      {/* <p>{getFormattedDate(data.updateTime)}</p> */}
                    </div>
                  </td>
                  <td>
                    <p className={`mb-0 fs-13 fw-semibold lh-2${data.unRealizedProfit > 0 ? " text-success" : " text-danger"}`}>
                    {formatToExactDecimals(parseFloat(data.unRealizedProfit || 0),4)}
                    </p>
                  </td>
                  <td>
                    <p className={`mb-0 fs-13 fw-semibold lh-2`}>
                    {formatToExactDecimals(parseFloat(fetchedPrice?.find(pair => pair.pair.symbol === data.symbol)?.price || "0"), 4)}
                    </p>
                  </td>
                  <td>
                    <p className={`mb-0 fs-13 fw-semibold lh-2 `} >
                      {parseFloat(data.positionAmt || 0)}
                    </p>
                  </td>
                  <td>
                    <button className="px-2 py-1" onClick={()=>setCurrent_pair(data.symbol)} 
                     data-bs-toggle="modal"
                     data-bs-target="#autoprofitclosemodal"
                    >
                  <i class="ri-file-edit-line"></i>
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5}>
                  <p className="text-center">No Data Found</p>
                </td>
              </tr>
            )}

            {/* <tr>
            <td colSpan={3} className="text-center">
              <div
                onClick={() => {
                  navigate("/allDataTable", {
                    state: { reduxName: "binanceFuture", type: "FUTURES" , platform: "BINANCE" },
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
                    // Store data in localStorage
                    const dataToStore = {
                      reduxName: "binanceFuture",
                      type: "FUTURES",
                      platform: "BINANCE",
                      extraReduxName: "bitgetFuture",
                      extraPlatform: "BITGET",
                    };
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

      <div className="d-flex justify-content-between align-items-center mt-3">
        <div
          onClick={() => {
            // Store data in localStorage
            const dataToStore = {
              reduxName: "binanceFuture",
              type: "FUTURES",
              platform: "BINANCE",
              extraReduxName: "bitgetFuture",
              extraPlatform: "BITGET",
            };
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
      <Buysellfuturemodal />
      <AutoProfitCloseModal current_pair={current_pair} platform="BINANCE"/>
    
    </>
  );
};

export default Table;
