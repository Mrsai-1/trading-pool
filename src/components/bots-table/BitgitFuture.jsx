import React, { useEffect, useRef, useState, Suspense, useMemo } from "react";
import { bitgetFutureRdx } from "../reduxStore/slice/bitgetfutureSlice";
import {
  backEndCallObj,
  backEndCallObjNoDcyt,
} from "../../services/mainService";
import BitgetFutureTable from "../../common/BitgetFutureTable";
import { connect } from "react-redux";
import useFetchKeys from "../../common/CotextTest";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import MiniLoader from "../../common/MiniLoader";
// Lazy load components
// const ConfirmPopup = React.lazy(() => import("../models/ConfirmPopup"));
// const EditBitgetFuture = React.lazy(() =>
//   import("../models/EditBitgetFutures")
// );


import ConfirmPopup from "../models/ConfirmPopup";
import EditBitgetFuture from "../models/EditBitgetFutures";

// const EditBinanceSpotModal = React.lazy(() => import("../models/EditBinanceSpot"));

const BitgitFuture = ({ dispatch, bitgetFuture, getProfile }) => {
  const [formData] = useState({
    platform: "BITGET",
    bot: "FUTURES",
  });

  const [data, setData] = useState({
    platform: "BITGET",
    botType: "FUTURES",
    total_investment: "",
  });

  const [btnDisable, setBtnDisable] = useState(false);
  const [botStatus, setBotStatus] = useState("ADD");
  const [datamodal, setDataModala] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const { fetchKeys, fetchData, formatToExactDecimals } = useFetchKeys();

  const { bots, api_keys } = getProfile?.profile || {};

  const { open_trades, usdt_balance, total_investment } = bitgetFuture || {};

  const modelRef = useRef(null);
  const closeRef = useRef(null);


  useEffect(() => {
    if (bots?.[formData?.platform] && api_keys?.[formData?.platform]) {
      if (!bitgetFuture) {
        fetchData(formData, setLoading, bitgetFutureRdx);
      }
    }
  }, [dispatch, bots]);

  useEffect(() => {
    if (bots?.BITGET?.FUTURES?.status === "INACTIVE") {
      setBotStatus("Disable");
    } else if (bots?.BITGET?.FUTURES?.status === "ACTIVE") {
      setBotStatus("Enable");
    } else {
      setBotStatus("ADD");
    }
  }, [bots]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setBtnDisable(true);
    // const validationErrors = validate();
    // setErrors(validationErrors || {});
    // if (validationErrors) {
    //   setBtnDisable(false);
    //   return;
    // }
    const formattedData = {
      ...formData,
      status:
        bots?.BITGET?.FUTURES?.status === "INACTIVE" ? "ACTIVE" : "INACTIVE",
    };

    try {
      setBtnDisable(true);
      const response = await backEndCallObj(
        "/admin/change_bot_status",
        formattedData
      );
      toast.success(response?.success);
      fetchKeys();
    } catch (error) {
      toast.error(error?.response?.data);
    } finally {
      setBtnDisable(false);
    }
  };

  const submitBot = async (data) => {
    setBtnDisable(true);
    const formattedData = {
      platform: data.platform,
      bot: data.botType,
      total_investment: data.total_investment,
    };
    try {
      const response = await backEndCallObj("/admin/add_bot", formattedData);
      toast.success(response?.success);
      const modalInstance = window.bootstrap.Modal.getInstance(closeRef.current);
      if (modalInstance) modalInstance.hide();
      fetchKeys();
    } catch (error) {
      toast.error(error?.response?.data || "Error adding bot");
    } finally {
      setBtnDisable(false);
    }
  };

  const toggleBotStatus = async (e) => {
    await handleSubmit(e);

    const modalInstance = window.bootstrap.Modal.getInstance(modelRef.current);
    if (modalInstance) modalInstance.hide();
  };

  //table header data
  const theadData = ["Symbol", "Profit", "PositionAmt"];

  const handleChangeBotStatusBiFuture = (e) => {
    e.stopPropagation();
    setDataModala(true);
    const modalElement = document.getElementById("binanceFutureBotModal");
    if (modalElement) {
      let modalInstance = window.bootstrap.Modal.getInstance(modalElement);
      if (!modalInstance) {
        modalInstance = new window.bootstrap.Modal(modalElement);
      }
      modalInstance.show();
    } else {
      console.error("Modal element not found!");
    }
  };

  const buttonContent = useMemo(() => {
    const botStatus = bots?.BITGET?.FUTURES?.status;


    if (botStatus === "INACTIVE" || botStatus === "ACTIVE") {
      return (
        <div className="toggle-switch">
          <input
            className="toggle-input"
            id="toggle-button"
            type="checkbox"
            checked={botStatus === "ACTIVE"}
            onChange={(e) => handleChangeBotStatusBiFuture(e)}
          />
          <label className="toggle-label" htmlFor="toggle-button"></label>
        </div>
      );
    }
    if (api_keys?.[formData?.platform]?.api_key) {
      return (
        <button
          className="theme-btn success-color text-uppercase"
          type="button"
          data-bs-toggle="modal"
          data-bs-target="#ADDBOOT"
        >
          Add Bot
        </button>
      );
    }
    return (
      <button
        className="theme-btn success-color text-uppercase"
        type="button"
        onClick={() =>
          navigate("/api", { state: { platform: formData?.platform } })
        }
      >
        Add Bot
      </button>
    );
  }, [bots, api_keys, formData, navigate, botStatus]);


  // const capital_investment = parseFloat(usdt_balance?.availableBalance / total_investment || 0).toFixed(2);

  const difference = usdt_balance?.availableBalance - total_investment;
  // let capital_investment = ((difference / total_investment) * 100);
  let capital_investment = formatToExactDecimals(((difference / total_investment) * 100 || 0), 2);


  // Handle NaN case explicitly
  if (!isFinite(capital_investment)) {
    capital_investment = "0.00";
  }

  return (
    <>
      {/* <Suspense
        fallback={
          <div>
            <MiniLoader />
          </div>
        }
      > */}
        {loading ? (
          <div className="loader">
            <MiniLoader />
          </div>
        ) : (
          <>
            <div className="bot-status d-flex flex-wrap justify-content-between gap-2 mb-2">
              <div
                className="custom-border d-flex flex-column align-items-center justify-content-between flex-fill p-1 cursor-pointer"
                data-bs-toggle="modal"
                data-bs-target="#editBitgetFuturemodal"
              >
                <h6 className="mb-0 fw-bold fs-15">
                  {parseFloat(total_investment || 0)}
                </h6>
                <p className="mb-0 text-capitalize primary-color fs-12 fw-semibold">
                  capital assigned
                </p>
              </div>
              <div className="custom-border d-flex flex-column align-items-center justify-content-between flex-fill p-1">
                <h6 className="mb-0 fw-bold fs-15">
                  {formatToExactDecimals(parseFloat(usdt_balance?.balance || 0), 2)}
                </h6>
                <p className="mb-0 text-capitalize primary-color fs-12 fw-semibold">
                  current balance
                </p>
              </div>
              <div className="custom-border d-flex flex-column align-items-center justify-content-between flex-fill p-1">
                <h6
                  className={`mb-0 status-percent fw-bold px-2 py-1 fs-13 ${capital_investment < 0 ? "bg-danger" : "bg-success"
                    }`}
                >
                  {capital_investment > 0
                    ? `+${capital_investment}`
                    : `${capital_investment}`}
                  %
                </h6>
                <p
                  className={`mb-0 text-capitalize primary-color fs-12 fw-semibold ${capital_investment < 0 ? "text-danger" : "text-success"
                    }`}
                >
                  % change
                </p>
              </div>
              <div className="custom-border d-flex justify-content-center align-items-center flex-fill p-1">
                {buttonContent}
              </div>
            </div>
            <BitgetFutureTable data={open_trades} thead={theadData} />
            <ConfirmPopup
              label="Bot Status"
              msg={`${botStatus === "Enable" ? "Disable" : "Enable"} bot`}
              botStatus={botStatus === "Enable" ? "Disable" : "Enable"}
              toggleBotStatus={toggleBotStatus}
              modelRef={modelRef}
              btnDisable={btnDisable}
              id="binanceFutureBot"
            />

            <EditBitgetFuture
              botType={formData.bot}
              platform={formData.platform}
              fetchData={fetchData}
            />



            <div className="modal fade" id="ADDBOOT" ref={closeRef}>
              <div className="modal-dialog text-dark modal-dialog-centered">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title primary-color text-capitalize">
                      Add Bot Configuration
                    </h5>
                    <button
                      type="button"
                      className="btn-close"
                      data-bs-dismiss="modal"
                    ></button>
                  </div>
                  <div className="modal-body">
                    <form
                      onSubmit={(e) => {
                        submitBot(data);
                        e.preventDefault();
                      }}
                    >
                      <div className="mb-3">
                        <input
                          type="text"
                          className="form-control"
                          id="platform"
                          name="platform"
                          placeholder="Platform"
                          value={data?.platform}
                          readOnly
                        />
                      </div>
                      <div className="mb-3">
                        <input
                          type="text"
                          className="form-control"
                          id="botType"
                          name="botType"
                          placeholder="Bot Type"
                          value={data?.botType}
                          readOnly
                        />
                      </div>

                      <div className="mb-3">
                        <input
                          type="number"
                          className="form-control"
                          id="total_investment"
                          name="total_investment"
                          placeholder="Total Investment"
                          value={data?.total_investment}
                          onChange={(e) =>
                            setData({
                              ...data,
                              total_investment: e.target.value,
                            })
                          }
                          required
                        />
                      </div>
                      <div className="text-end px-2">
                        <button
                          className="sign my-2 py-2 px-3 rounded"
                          type="submit"
                          disabled={btnDisable}
                        >
                          Submit
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      {/* </Suspense> */}
    </>
  );
};

// Map Redux state to props
const mapStateToProps = (state) => {
  return {
    bitgetFuture: state.bitgetFuture.value, // Access the slice state
    getProfile: state.getProfile.value,
  };
};

export default connect(mapStateToProps)(BitgitFuture);
