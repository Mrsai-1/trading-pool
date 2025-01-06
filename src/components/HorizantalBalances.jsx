import React, { useState } from 'react'
import useFetchKeys from '../common/CotextTest';

const HorizantalBalances = ({type , getRedux}) => {


  const {  formatToExactDecimals } = useFetchKeys();
    const { usdt_balance } = getRedux || {};


    return (
        <>
           
                <div
                    className="d-flex justify-content-start align-items-center overflow-auto text-nowrap p-2 d-block d-md-none"

                >
                    {/* Check if the type is 'FUTURES', then show Object.values */}
                    {type === "FUTURES" ?
                        // ? Object?.values(usdt_balance || {})?.map((balance, index) => (

                        usdt_balance ? (<div
                            className="text-center w-ft-content mx-2 border rounded shadow-sm d-flex align-items-baseline gap-1 justify-content-center flex-row-reverse p-1 pt-0 custom-balances-font-size"

                        >
                            {/* Show balance data */}
                            <div className="fw-bold mt-1 primary-color opacity-75"

                            >
                                {/* Display assets and available_balance */}
                                {usdt_balance?.asset}
                            </div>
                            <div className="fw-bold primary-color"
                            // style={{ fontSize: "15px", fontWeight: "bold", color: "#6c757d" }}
                            >
                                {formatToExactDecimals(usdt_balance?.balance || 0, 2)}
                            </div>
                        </div>) : <div className="text-center fw-bold w-100">No Balance Available</div>


                        // ))
                        : /* If type is not FUTURES, use Object.entries */
                        Object?.entries(getRedux?.balances || {})?.map(([currency, value], index) => (
                            <div
                                key={index}
                                className="w-ft-content text-center mx-2 border rounded shadow-sm d-flex align-items-baseline gap-1 justify-content-center flex-row-reverse p-1 pt-0 custom-balances-font-size"
                           
                            >
                                {/* Show currency and value */}
                                <div className="fw-bold primary-color"
                                >
                                    ({currency})
                                </div>
                                <div
                                    className="fw-bold mt-1 primary-color"
                               
                                >
                                    {/* {value.toFixed(2)} */}
                                    {
                                        formatToExactDecimals(parseFloat(value || 0), 2)
                                    }
                                </div>
                            </div>
                        ))}
                </div>
                
           
        </>
    )
}

export default HorizantalBalances