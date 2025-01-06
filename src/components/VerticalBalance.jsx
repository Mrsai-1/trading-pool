import React from 'react'
import useFetchKeys from '../common/CotextTest';

const VerticalBalance = ({ type, getRedux }) => {


    const { getCoinicons } = useFetchKeys();
    const { usdt_balance } = getRedux || {};
    return (
        <>
                <div className="card shadow-sm p-3 h-100">
                    <div className="d-flex flex-column gap-2 overflow-auto custom-balanceTable" >
                        {type !== "FUTURES" ? (
                            Object.entries(getRedux?.balances || {}).map(([currency, value], index) => (
                                <div
                                    key={index}
                                    className="d-flex justify-content-between align-items-center border rounded p-1 shadow-sm primary-color"
                                >
                                    <div className="d-flex gap-2 align-items-center justify-content-start">
                                        <img
                                            src={getCoinicons(currency)}
                                            alt={currency}
                                            className="cryptocurreny-icon-table crypto-icon"
                                            width={25}
                                        />
                                        <h6 className="fw-bold mb-0 fs-12">{currency}</h6>
                                    </div>
                                    <span className="fw-semibold fs-12 opacity-75">{value.toFixed(2)}</span>
                                </div>
                            ))
                        ) : (
                            <div className="d-flex justify-content-between align-items-center border rounded p-2 shadow-sm">
                                <span className="fw-bold primary-color">USDT</span>
                                <span className="fw-semibold fs-16 primary-color opacity-75">
                                    {parseFloat(usdt_balance?.balance || 0).toFixed(2)}
                                </span>
                            </div>
                        )}
                    </div>

                    {
                        type === "FUTURES" && (
                            <button
                                className="py-2 px-2"
                                data-bs-toggle="modal"
                                data-bs-target="#buysellfuturemodal"
                            >
                                Buy Sell
                            </button>
                        )
                    }

                </div>
        </>
    )
}

export default VerticalBalance