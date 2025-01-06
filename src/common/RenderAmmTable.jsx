import { toast } from "react-toastify";
import { backEndCallObj, getCurrentUser } from "../services/mainService";
import useFetchKeys from "./CotextTest";
import { useState } from "react";
import React from "react";
import CloseTradeModal from "../components/models/CloseTradesModal";


const RenderAmmTable = ({ sortedData, loading, setLoading, platform, setData, changeDateTimeFormate, searchData, selectedSlice, bot , setCloseTradeBtn }) => {

    // const [closeTradeBtn, setCloseTradeBtn] = useState({
    //     symbol: "",
    //     order_id: "",
    // });
    const [closeTradeDisable, setCloseTradeDisable] = useState(false);
    const [formData] = useState({
        bot: bot,
        platform: platform,
    });

    const closeTradeRef = React.createRef();

    const { formatToExactDecimals, getCoinicons, fetchData } = useFetchKeys();
    const user = getCurrentUser();

    // const closeTrade = async () => {
    //     setCloseTradeDisable(true);

    //     const formattedData = {
    //         platform: platform,
    //         order_id: Number(closeTradeBtn.order_id),
    //         symbol: closeTradeBtn.symbol,
    //     };

    //     try {
    //         const response = await backEndCallObj(
    //             "/trades/cancel_pending_order",
    //             formattedData
    //         );
    //         toast.success(response?.success);
    //         // const modalInstance = window?.bootstrap?.Modal?.getInstance(closeTradeRef?.current);
    //         // if (modalInstance) modalInstance?.hide();
    //         fetchData(formData, setLoading, selectedSlice);
    //     } catch (error) {
    //         toast.error(error?.response?.data);
    //     } finally {
    //         setCloseTradeDisable(false);
    //     }
    // };

 
    const handleCloseClick_two = (row) => {
        setCloseTradeBtn({
            order_id: row.orderId, // Set the pair as the clicked row's symbol
            symbol: row.symbol,
            type: bot,
        });

        const modalElement = document.getElementById("closeTradeModalFutures");
        // if (modalElement) {
        const modal = new window.bootstrap.Modal(modalElement);
        modal.show();
    };

    const filteredCoins = sortedData?.filter((item) => item.symbol.includes(searchData.toUpperCase())); // Apply the filter condition

    return (
        <>
            <table className="table table-bordered text-center table-striped align-middle">
                <thead className="thead primary-bg">
                    <tr>
                        <th>
                            <p className="mb-0 primary-color fs-12">Symbol</p>
                        </th>
                        <th className="d-none d-md-table-cell">
                            <p className="mb-0 primary-color fs-12">Order ID</p>
                        </th>
                        <th>
                            <p className="mb-0 primary-color fs-12">
                                {platform === "BINANCE" ? "Price" : "Avg Price"}
                            </p>
                        </th>
                        <th>
                            <p className="mb-0 primary-color fs-12">
                                {platform === "BINANCE" ? "origQty" : "Size"}
                            </p>
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
                                <p className="mt-2 mb-0 fw-semibold">Loading data...</p>
                            </td>
                        </tr>
                    ) : filteredCoins?.length > 0 ? (
                        filteredCoins.map((item, index) => (
                            <tr key={index}>
                                <td className="w-25">
                                    <div className="d-flex align-items-center justify-content-center gap-1">
                                        <img
                                            src={getCoinicons(item?.symbol)}
                                            alt={item?.name}
                                            className="cryptocurreny-icon-table crypto-icon"
                                        />
                                        <div className="d-flex align-items-start flex-column">
                                            <p className="mb-0 fw-bold primary-color custom-width-symbole">
                                                {item?.symbol || "NA"}
                                            </p>
                                            <p className="mb-0 fs-10 fw-semibold text-nowrap">
                                                {platform === "BINANCE"
                                                    ? changeDateTimeFormate(item?.time)
                                                    : changeDateTimeFormate(item?.cTime)}
                                            </p>
                                        </div>
                                    </div>
                                </td>
                                <td className="d-none d-md-table-cell">
                                    <p className="mb-0 fs-12 fw-semibold">{item?.orderId}</p>
                                </td>
                                <td>
                                    <p className="mb-0 fs-12 fw-semibold">
                                        {formatToExactDecimals(parseFloat(platform === "BINANCE" ? item?.price : item?.priceAvg), 4)}
                                    </p>
                                </td>
                                <td>
                                    <p className="mb-0 fs-12 fw-semibold">
                                        {platform === "BINANCE" ? formatToExactDecimals(parseFloat(item.origQty || 0), 4) : item?.size}
                                    </p>
                                </td>

                                <td>
                                    <div className="d-flex align-items-center justify-content-center gap-3 d-flex flex-column flex-sm-row">
                                        {user?.user_type === "ADMIN" && (
                                             <button
                                             className="px-2 py-1 fs-13 rounded"
                                             onClick={() => handleCloseClick_two(item)}
                                         >
                                             Close
                                         </button>
                                        )}
                                        <a
                                            className="primary-color text-decoration-none fw-semibold cursor-pointer fs-14"
                                            data-bs-toggle="modal"
                                            data-bs-target="#viewModal"
                                            onClick={() => setData(item)}
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
                    {/* <CloseTradeModal
                        label="Close Trade"
                        msg="Close Trade"
                        botStatus="Close"
                        toggleBotStatus={closeTrade}
                        modelRef={closeTradeRef}
                        btnDisable={closeTradeDisable}
                        id="closeTradeModalAmm"
                    /> */}
                </tbody>

            </table>

        </>
    );
};

export default RenderAmmTable;