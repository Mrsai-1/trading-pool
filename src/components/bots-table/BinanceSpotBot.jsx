import React, { Suspense, useEffect, useRef, useState } from "react";
import Table from "../../common/Table";
import {
  backEndCallObj,
  backEndCallObjNoDcyt,
} from "../../services/mainService";
import { binancespotRedx } from "../reduxStore/slice/binancespotSlice";
import { connect } from "react-redux";
import BinanceSpotTable from "../../common/BinanceSpotTable";
import { toast } from "react-toastify";
import useFetchKeys from "../../common/CotextTest";
import { useNavigate } from "react-router-dom";
import EditInvestment from "../models/EditInvestmentModel";
import MiniLoader from "../../common/MiniLoader";

const ConfirmPopup = React.lazy(() => import("../models/ConfirmPopup"));
const EditBinanceSpotModal = React.lazy(() => import("../models/EditBinanceSpot"));

const BinanceSpotBot = ({ dispatch, binanceSpot, getProfile }) => {
  const [formData] = useState({
    platform: "BINANCE",
    bot: "AMM",
  });

  const [data, setData] = useState({
    platform: "BINANCE",
    botType: "AMM",
    total_investment: "",
  });

  const [botStatus, setBotStatus] = useState("ADD");

  const [btnDisable, setBtnDisable] = useState(false);

  const [loading, setLoading] = useState(false);

  const [datamodal, setDataModala] = useState(false);

  const modelRef = useRef(null);

  const { fetchKeys, fetchData, formatToExactDecimals } = useFetchKeys();

  const navigate = useNavigate();

  const closeRef = useRef(null);



  const { open_trades, totalBalance, total_investment } = binanceSpot || {};
  const { bots, api_keys } = getProfile?.profile || {};



  // const fetchData = async () => {
  //   setLoading(true);
  //   try {
  //     const response = await backEndCallObjNoDcyt(
  //       "/trades/get_open_trades_data",
  //       formData
  //     );
  //     dispatch(binancespotRedx(response)); // Dispatch the action to Redux
  //   } catch (error) {
  //     console.error("Error fetching open trades data:", error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  useEffect(() => {
    if (bots?.[formData?.platform] && api_keys?.[formData?.platform]) {
      if (!binanceSpot) {
        fetchData(formData, setLoading, binancespotRedx);
      }
    }
  }, [dispatch, bots]);

  useEffect(() => {
    if (bots?.BINANCE?.AMM?.status === "INACTIVE") {
      setBotStatus("Disable");
    } else if (bots?.BINANCE?.AMM?.status === "ACTIVE") {
      setBotStatus("Enable");
    } else {
      setBotStatus("ADD");
    }
  }, [bots]);



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
      const modalInstance = window.bootstrap.Modal.getInstance(this.closeRef.current);
      if (modalInstance) modalInstance.hide();
      fetchKeys();
    } catch (error) {
      toast.error(error?.response?.data || "Error adding bot");
    } finally {
      setBtnDisable(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setBtnDisable(true);

    const formattedData = {
      ...formData,
      status: bots?.BINANCE?.AMM?.status === "INACTIVE" ? "ACTIVE" : "INACTIVE",
    };

    try {
      const response = await backEndCallObj("/admin/change_bot_status", formattedData);
      toast.success(response?.success);
      fetchKeys();
    } catch (error) {
      toast.error(error?.response?.data);
    } finally {
      setBtnDisable(false);
    }
  };


  const toggleBotStatusBiAmm = async (e) => {
    await handleSubmit(e);
    const modalInstance = window.bootstrap.Modal.getInstance(modelRef.current);
    if (modalInstance) modalInstance.hide();
  };

  //table header data
  const theadData = ["Symbol", "Price", "Org Qty"];

  const changeBotStatus = (e) => {
    e.stopPropagation();
    setDataModala(true);
    const modalElement = document.getElementById("binanceSpotBot");
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


  const handleButtonClick = () => {
    if (bots?.BINANCE?.AMM?.status === "INACTIVE" || bots?.BINANCE?.AMM?.status === "ACTIVE") {
      return (
        <div className="toggle-switch">
          <input
            className="toggle-input"
            id={`toggle`}
            name="binanceSpotBot"
            type="checkbox"
            checked={botStatus === "Enable"}
            onChange={(e) => {changeBotStatus(e)}}
          />
          <label className="toggle-label" htmlFor={`toggle`}></label>
        </div>
      );
    }
    if (api_keys?.[formData?.platform]?.api_key) {
      return (
        <button
          className="theme-btn success-color text-uppercase"
          type="button"
          data-bs-toggle="modal"
          data-bs-target="#binanceBot"
        >
          Add Bot
        </button>
      );
    }
    return (
      <button
        className="theme-btn success-color text-uppercase"
        type="button"
        onClick={() => navigate("/api", { state: { platform: formData.platform } })}
      >
        Add Bot
      </button>
    );
  };

  // const capital_investment = parseFloat(totalBalance / total_investment || 0).toFixed(2);

  const difference = totalBalance - total_investment;
  // let capital_investment = ((difference / total_investment) * 100);
  let capital_investment = formatToExactDecimals(((difference / total_investment) * 100 || 0), 2);


  if (!isFinite(capital_investment)) {
    capital_investment = "0.00";
  }





  return (
    <Suspense fallback={<MiniLoader />}>
      {loading ? (
        <div className="loader">
          <MiniLoader />
        </div>
      ) : (
        <>
          <div className="bot-status d-flex flex-wrap justify-content-between gap-2 pb-1">
            <div
              className="border d-flex flex-column align-items-center justify-content-between flex-fill p-1 cursor-pointer"
              data-bs-toggle="modal"
              data-bs-target="#editBinanceSpotModal"
            >
              <h6 className="mb-0 fw-bold fs-15">
                {parseFloat(total_investment || 0)}
              </h6>
              <p className="mb-0 text-capitalize primary-color fs-12 fw-semibold">
                capital assigned
              </p>
            </div>
            <div className="border d-flex flex-column align-items-center justify-content-between flex-fill p-1">
              <h6 className="mb-0 fw-bold fs-15">
                {formatToExactDecimals(parseFloat(totalBalance || 0), 2)}
              </h6>
              <p className="mb-0 text-capitalize primary-color fs-12 fw-semibold">
                current balance
              </p>
            </div>
            <div className="border d-flex flex-column align-items-center justify-content-between flex-fill p-1">
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
            <div className="border d-flex justify-content-center align-items-center flex-fill p-1">
              {handleButtonClick()}

            </div>
          </div>
          <BinanceSpotTable data={open_trades} tdata={theadData} />

          <ConfirmPopup
            label="Bot Status"
            msg={`${botStatus === "Enable" ? "Disable" : "Enable"} bot`}
            botStatus={botStatus === "Enable" ? "Disable" : "Enable"}
            toggleBotStatus={toggleBotStatusBiAmm}
            modelRef={modelRef}
            btnDisable={btnDisable}
            id="binanceSpotBot"
          />


          <EditBinanceSpotModal
            botType={formData.bot}
            platform={formData.platform}
            fetchData={fetchData}
          />

          <div className="modal fade" id="binanceBot" tabIndex="-1" ref={closeRef}>
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
                          setData({ ...data, total_investment: e.target.value })
                        }
                        required
                      />
                    </div>
                    <div className="text-end mx-2">
                      <button
                        className="sign mt-3"
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
    </Suspense>
  );
};

// Map Redux state to props
const mapStateToProps = (state) => {
  return {
    binanceSpot: state.binanceSpot.value, // Access the slice state
    getProfile: state.getProfile.value, // Access the slice state
  };
};

export default connect(mapStateToProps)(BinanceSpotBot);
