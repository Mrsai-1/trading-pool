import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useFetchKeys from "./CotextTest";
import BuysellFutureModal from "../components/models/BuysellFutureModal";
import AutoProfitCloseModal from "../components/models/AutoProfitCloseModal";

const BitgetFutureTable = ({ data }) => {
  const { getCoinicons, formatToExactDecimals , getValuepp } = useFetchKeys();
  const [current_pair , setCurrent_pair] = useState(null);
      const [fetchedPrice, setFetchedPrice] = useState(null);

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

  const navigate = useNavigate();

  return (
    <>
      <div className="table-responsive bots-table-area">
        <table className="table table-bordered text-center mb-0">
          <thead className="thead primary-bg">
            <tr>
              <th>
                <p className="mb-0 primary-color fs-14">Symbol</p>
              </th>
              <th>
                <p className="mb-0 primary-color fs-14">Profit</p>
              </th>
              <th>
                <p className="mb-0 primary-color fs-14">CurrentPrice</p>
              </th>
              <th>
                <p className="mb-0 primary-color fs-14">PositionAmt</p>
              </th>
              <th>
                <p className="mb-0 primary-color fs-14">Action</p>
              </th>
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
                    </div>
                  </td>
                  <td>
                    <p className={`mb-0 fs-13 fw-semibold lh-2 ${data.unRealizedProfit > 0 ? " text-success" : " text-danger"}`}>
                      {parseFloat(data.unRealizedProfit || 0)}
                    </p>
                  </td>
                  <td>
                    <p className={`mb-0 fs-13 fw-semibold lh-2`}>
                    {formatToExactDecimals(parseFloat(fetchedPrice?.find(pair => pair.pair.symbol === data.symbol)?.price || "0"), 4)}
                    </p>
                  </td>
                  <td>
                    <p className="mb-0 fs-13 fw-semibold">
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
      <div className="d-flex justify-content-between align-items-center mt-3">
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
       <AutoProfitCloseModal current_pair={current_pair} platform="BITGET"/>
    </>
  );
};

export default BitgetFutureTable;
