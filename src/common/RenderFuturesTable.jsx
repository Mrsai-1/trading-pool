import React, { Suspense, useEffect, useRef, useState } from "react";
import useFetchKeys from "./CotextTest";
import { backEndCallObj, getCurrentUser } from "../services/mainService";
import { toast } from "react-toastify";
import ConfirmPopup from "../components/models/ConfirmPopup";    // Importing ConfirmPopup component


const RenderFuturesTable = ({ sortProfit, sortAscending, loading, sortedData, bot, platform, setLoading, selectedSlice, getRedux, setData, searchData,setCloseTradeBtn }) => {
    const [fetchedPrice, setFetchedPrice] = useState(null);
    const [closeTradeDisable, setCloseTradeDisable] = useState(false);
    // const [closeTradeBtn, setCloseTradeBtn] = useState({
    //     pair: "",
    // });
    const [formData] = useState({
        bot: bot,
        platform: platform,
    });


    const closeTradeRef = useRef(null);


    const user = getCurrentUser();


    const { fetchData, formatToExactDecimals, getValuepp, getCoinicons } = useFetchKeys();

    // const closeTrade = async () => {
    //     setCloseTradeDisable(true);

    //     const formattedData = {
    //         pair: closeTradeBtn.pair,
    //     };




    //     try {
    //         const response = await backEndCallObj(
    //             "/admin/close_future_coin",
    //             formattedData
    //         );
    //         toast.success(response?.success);
    //         const modalInstance = window?.bootstrap?.Modal?.getInstance(closeTradeRef?.current);
    //         if (modalInstance) modalInstance?.hide();
    //         document.querySelector('.modal-backdrop')?.remove();
    //         fetchData(formData, setLoading, selectedSlice);
    //     } catch (error) {
    //         toast.error(error?.response?.data);
    //     } finally {
    //         setCloseTradeDisable(false);
    //     }
    // };




    const getTargetPrices = async () => {
        try {
            // Guard clause for empty sortedData
            if (sortedData.length === 0) {
                return;
            }

            const fetchedPrices = [];
            for (let i = 0; i < sortedData.length; i++) {
                const { data } = await getValuepp(sortedData[i].symbol);
                fetchedPrices.push({
                    pair: sortedData[i],
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
        if (getRedux?.open_trades) {
            getTargetPrices();
        }
    }, [getRedux?.open_trades]);


    const filteredCoins = sortedData?.filter((item) => item.symbol.includes(searchData.toUpperCase())); // Apply the filter condition


    const handleCloseClick = (row) => {
        setCloseTradeBtn({
            pair: row.symbol, // Set the pair as the clicked row's symbol
        });

        const modalElement = document.getElementById("closeTradeModalFutures");
        // if (modalElement) {
        const modal = new window.bootstrap.Modal(modalElement);
        modal.show();
    };

    return (
        <>
            <table className="table table-bordered text-center table-striped align-middle">
                <thead className="thead primary-bg">
                    <tr>
                        <th>
                            <p className="mb-0 primary-color fs-12 text-center">Symbol</p>
                        </th>
                        <th>
                            <p className="mb-0 primary-color fs-12 text-center">Amount</p>
                        </th>
                        <th onClick={sortProfit} className="cursor-pointer text-nowrap">
                            <p className="mb-0 primary-color fs-12 text-center">
                                Profit {sortAscending ? "↑" : "↓"}
                            </p>
                        </th>
                        <th className="d-none d-md-table-cell">
                            <p className="mb-0 primary-color fs-12 text-center">Entry Price</p>
                        </th>
                        <th className="d-none d-md-table-cell">
                            <p className="mb-0 primary-color fs-12 text-center">Current Price</p>
                        </th>
                        <th className="d-none d-md-table-cell">
                            <p className="mb-0 primary-color fs-12 text-center">Target</p>
                        </th>
                        <th className="d-none d-md-table-cell">
                            <p className="mb-0 primary-color fs-12 text-center">Side</p>
                        </th>
                        <th>
                            <p className="mb-0 primary-color fs-12 text-center">Action</p>
                        </th>
                    </tr>
                </thead>
                <tbody className="tbody">
                    {loading ? (
                        <tr>
                            <td colSpan={10} className="text-center py-5">
                                <div className="spinner-border text-primary" role="status">
                                    <span className="visually-hidden">Loading...</span>
                                </div>
                                <p className="mt-2">Loading data...</p>
                            </td>
                        </tr>
                    ) : filteredCoins?.length > 0 ? (
                        filteredCoins.map((row, index) => (
                            <tr key={index}>
                                <td>
                                    <div className="d-flex flex-column align-items-center justify-content-center">
                                        <div className="d-flex align-items-center gap-2">
                                            <img
                                                src={getCoinicons(row?.symbol)}
                                                alt={row?.name}
                                                className="crypto-icon"
                                                width={25}
                                                style={{ objectFit: "contain" }}
                                            />
                                            <p className="mb-0 fs-14 d-block primary-color fw-bold">{row?.symbol || "NA"}</p>
                                        </div>
                                        <div className="text-left d-block d-md-none">
                                            <p className="mb-0 fs-14">
                                                {formatToExactDecimals(parseFloat(row?.entryPrice || "0"), 4)}
                                            </p>
                                        </div>
                                        <div className="text-center d-block d-md-none">
                                            <p className="mb-0 fs-14">
                                                {formatToExactDecimals(
                                                    parseFloat(
                                                        row?.positionAmt > 0
                                                            ? parseFloat(row?.entryPrice) +
                                                            parseFloat(row?.entryPrice) * 0.004
                                                            : parseFloat(row?.entryPrice) -
                                                            parseFloat(row?.entryPrice) * 0.004
                                                    ) || "0",
                                                    4
                                                )}
                                            </p>
                                        </div>
                                    </div>
                                </td>
                                <td>
                                    <p className="mb-0 fs-12 fw-semibold lh-2">
                                        {formatToExactDecimals(parseFloat(row?.positionAmt || "0"), 4)}
                                    </p>
                                </td>
                                <td>
                                    <p
                                        className={`mb-0 fs-12 fw-semibold lh-2 ${row?.unRealizedProfit < 0 ? "text-danger" : "text-success"
                                            }`}
                                    >
                                        {formatToExactDecimals(parseFloat(row?.unRealizedProfit || "0"), 4)}
                                    </p>
                                </td>
                                <td className="d-none d-md-table-cell">
                                    <p className="mb-0 fs-12 fw-semibold lh-2 d-none d-sm-block">
                                        {formatToExactDecimals(parseFloat(row?.entryPrice || "0"), 4)}
                                        {/* {row?.positionAmt > 0
                            ? parseFloat(row?.entryPrice) +
                            parseFloat(row?.entryPrice) * 0.004
                            : parseFloat(row?.entryPrice) -
                            parseFloat(row?.entryPrice) * 0.004} */}
                                    </p>
                                </td>
                                <td className="d-none d-md-table-cell">
                                    <p className="mb-0 fs-12 fw-semibold lh-2 d-none d-sm-block" >

                                        {formatToExactDecimals(parseFloat(fetchedPrice?.find(pair => pair.pair.symbol === row.symbol)?.price || "0"), 4)}
                                        {/* { getTargetPrices()} */}

                                    </p>
                                </td>
                                <td className="d-none d-md-table-cell">
                                    <p className="mb-0 fs-12 fw-semibold lh-2 d-none d-sm-block">
                                        {/* {formatToExactDecimals(parseFloat(row?.breakEvenPrice || "0"),2)} */}

                                        {formatToExactDecimals(row?.positionAmt > 0
                                            ? (
                                                parseFloat(row?.entryPrice) +
                                                parseFloat(row?.entryPrice) * 0.004
                                            )
                                            : (
                                                parseFloat(row?.entryPrice) -
                                                parseFloat(row?.entryPrice) * 0.004
                                            ), 4)}
                                    </p>
                                </td>
                                <td className="d-none d-md-table-cell">
                                    <p className="mb-0 fs-12 fw-semibold lh-2 ">
                                        {row?.positionAmt > 0 ? "Buy" : row?.positionAmt < 0 ? "Sell" : "0"}
                                    </p>
                                </td>
                                <td>
                                    <div className="d-flex flex-column flex-sm-row  align-items-center justify-content-center gap-3">
                                        {/* {user?.user_type === "ADMIN" && ( */}
                                        <button
                                            className="px-2 py-1 fs-13 rounded"
                                            onClick={() => handleCloseClick(row)}
                                        >
                                            Close
                                        </button>
                                        {/* )} */}

                                        <a
                                            className="primary-color text-decoration-none fw-semibold cursor-pointer fs-14"
                                            data-bs-toggle="modal"
                                            data-bs-target="#viewModal"
                                            onClick={() => setData(row)}
                                        >
                                            view
                                        </a>
                                    </div>
                                </td>
                               

                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={10} className="text-center py-5">
                                <p className="text-center mb-0">No Data Found</p>
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>

            {/* <ConfirmPopup
                label="Close Trade"
                msg="Close Trade"
                botStatus="Close"
                toggleBotStatus={closeTrade}
                modelRef={closeTradeRef}
                btnDisable={closeTradeDisable}
                id="closeTradeModalFutures"
            /> */}
        </>
    );
};

export default RenderFuturesTable;