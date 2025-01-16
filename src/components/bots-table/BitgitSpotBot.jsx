import React, { Suspense, useEffect, useRef, useState } from "react";
import { connect } from "react-redux";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import {
  backEndCallObj,
  backEndCallObjNoDcyt,
} from "../../services/mainService";
import { bitgetSpotRedx } from "../reduxStore/slice/bitgitspotSlice";
import BitgetSpotTable from "../../common/BitgetSpotTable";
import useFetchKeys from "../../common/CotextTest";
import MiniLoader from "../../common/MiniLoader";

// Lazy load components
// const ConfirmPopup = React.lazy(() => import("../models/ConfirmPopup"));
// const EditInvestment = React.lazy(() => import("../models/EditInvestmentModel"));

import ConfirmPopup from "../models/ConfirmPopup";
import EditInvestment from "../models/EditInvestmentModel";

const BinanceSpotBot = ({ dispatch, bitgetSpot, getProfile }) => {
  const [formData] = useState({
    platform: "BITGET",
    bot: "AMM",
  });
  const [data, setData] = useState({
    platform: "BITGET",
    botType: "AMM",
    total_investment: "",
  });
  const [btnDisable, setBtnDisable] = useState(false);
  const [botStatus, setBotStatus] = useState("ADD");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { fetchKeys, fetchData, formatToExactDecimals } = useFetchKeys();
  const { bots, api_keys } = getProfile?.profile || {};
  const modelRef = useRef(null);
  const closeRef = useRef(null);

  const { open_trades, totalBalance, total_investment } = bitgetSpot || {};



  useEffect(() => {
    if (bots?.[formData?.platform] && api_keys?.[formData?.platform]) {
      if (!bitgetSpot) {
        fetchData(formData, setLoading, bitgetSpotRedx);
      }
    }
  }, [dispatch, bots]);

  useEffect(() => {
    if (bots?.BITGET?.AMM?.status === "INACTIVE") {
      setBotStatus("Disable");
    } else if (bots?.BITGET?.AMM?.status === "ACTIVE") {
      setBotStatus("Enable");
    } else {
      setBotStatus("ADD");
    }
  }, [bots]);

  const submitBot = async (data) => {
    setBtnDisable(true);
    const formattedData = {
      platform: data?.platform,
      bot: data?.botType,
      total_investment: data?.total_investment,
    };
    try {
      const response = await backEndCallObj("/admin/add_bot", formattedData);
      toast.success(response?.success);
      const modalInstance = window?.bootstrap?.Modal?.getInstance(closeRef?.current);
      if (modalInstance) modalInstance?.hide();
      fetchKeys();
    } catch (error) {
      toast.error(error?.response?.data || "Error adding bot");
    } finally {
      setBtnDisable(false);
    }
  };

  const toggleBotStatus = async (e) => {
    await handleSubmit(e);

    const modalInstance = window?.bootstrap?.Modal?.getInstance(modelRef?.current);
    if (modalInstance) modalInstance?.hide();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setBtnDisable(true);

    const formattedData = {
      ...formData,
      status: bots?.BITGET?.AMM?.status === "INACTIVE" ? "ACTIVE" : "INACTIVE",
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

  const handleChangeBot =(e)=>{
    e.stopPropagation();
    const modalElement = document.getElementById("bitgetSpotBot");
    if (modalElement) {
      let modalInstance = window.bootstrap.Modal.getInstance(modalElement);
      if (!modalInstance) {
        modalInstance = new window.bootstrap.Modal(modalElement);
      }
      modalInstance.show();
    } else {
      console.error("Modal element not found!");
    }
  }

  const handleButtonClick = () => {
    if (
      bots?.BITGET?.AMM?.status === "INACTIVE" ||
      bots?.BITGET?.AMM?.status === "ACTIVE"
    ) {
      return (
        // <button
        //   className={`${botStatus ==="Enable" ? "theme-btn text-uppercase bg-info" : "theme-btn text-uppercase bg-secondary" } `}
        //   type="button"
        //   data-bs-toggle="modal"
        //   data-bs-target="#bitgetSpotBot"
        // >
        //   {botStatus} Bot
        // </button>

        <div className="toggle-switch">
          <input
            className="toggle-input"
            id={`toggle`}
            type="checkbox"
            checked={botStatus === "Enable"}
            onChange={(e) => {handleChangeBot(e)}}

          />
          <label className="toggle-label" htmlFor={`toggle`}></label>
        </div>
      );
    }
    if (api_keys?.[formData?.platform]?.api_key) {
      return (
        <button
          className="theme-btn success-color text-uppercase text-white"
          type="button"
          data-bs-toggle="modal"
          data-bs-target="#bitgetModal"
        >
          Add Bot
        </button>
      );
    }
    return (
      <button
        className="theme-btn success-color text-uppercase text-white"
        type="button"
        onClick={() =>
          navigate("/api", { state: { platform: formData?.platform } })
        }
      >
        Add Bot
      </button>
    );
  };

  // const capital_investment = parseFloat(totalBalance / total_investment || 0).toFixed(2);

  const difference = totalBalance - total_investment;
  // let capital_investment = ((difference / total_investment) * 100);
  let capital_investment = formatToExactDecimals(((difference / total_investment) * 100 || 0), 2);


  // Handle NaN case explicitly
  if (!isFinite(capital_investment)) {
    capital_investment = "0.00";
  }

  return (
    <>
    {/* <Suspense fallback={<MiniLoader />}> */}
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
              data-bs-target="#editInvest"
            >
              <h6 className="mb-0 fw-bold fs-15">
                {parseFloat(total_investment || 0)}
              </h6>
              <p className="mb-0 text-capitalize fs-12 fw-semibold">
                Capital Assigned
              </p>
            </div>
            <div className="custom-border d-flex flex-column align-items-center justify-content-between flex-fill p-1">
              <h6 className="mb-0 fw-bold fs-15">
                {formatToExactDecimals(parseFloat(totalBalance || "0"), 2)}
              </h6>
              <p className="mb-0 text-capitalize  fs-12 fw-semibold">
                Current Balance
              </p>
            </div>
            <div className="custom-border d-flex flex-column align-items-center justify-content-between flex-fill p-1">
              <h6
                className={`mb-0 status-percent fw-bold px-2 py-1 fs-13 rounded-pill ${capital_investment < 0 ? "bg-danger" : "bg-success"
                  }`}
              >
                {capital_investment > 0
                  ? `+${capital_investment}`
                  : `${capital_investment}`}
                %
              </h6>
              <p
                className={`mb-0 text-capitalize  fs-12 fw-semibold ${capital_investment < 0 ? "text-danger" : "text-success"
                  }`}
              >
                % Change
              </p>
            </div>
            <div className="custom-border d-flex justify-content-center align-items-center flex-fill p-1">
              {handleButtonClick()}
            </div>
          </div>
          <ConfirmPopup
            label="Bot Status"
            msg={`${botStatus === "Enable" ? "Disable" : "Enable"} bot`}
            botStatus={botStatus === "Enable" ? "Disable" : "Enable"}
            toggleBotStatus={toggleBotStatus}
            modelRef={modelRef}
            btnDisable={btnDisable}
            id="bitgetSpotBot"
          />
          <EditInvestment
            botType={formData?.bot}
            platform={formData?.platform}
            onSuccess={() => {
            }}
            fetchData={fetchData}
          />
          <BitgetSpotTable
            data={open_trades}
            thead={["Symbol", "Price", "Org Qty"]}
          />
          <div className="modal fade" id="bitgetModal" ref={closeRef}>
            <div className="modal-dialog text-dark modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title text-capitalize">
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
                    <div className="mb-4">
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

                    <div className="mb-4">
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

                    <div className="mb-4">
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
    {/* </Suspense> */}
    </>
  );
};

const mapStateToProps = (state) => ({
  bitgetSpot: state?.bitgetSpot?.value,
  getProfile: state?.getProfile?.value,
});

export default connect(mapStateToProps)(BinanceSpotBot);
