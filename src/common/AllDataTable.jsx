import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate, useLocation } from "react-router-dom";
import useFetchKeys from "./CotextTest";
import { backEndCallObj, getCurrentUser } from "../services/mainService";
import { toast } from "react-toastify";
import ConfirmPopup from "../components/models/ConfirmPopup";
import { bitgetSpotRedx } from "../components/reduxStore/slice/bitgitspotSlice";
import { binancespotRedx } from "../components/reduxStore/slice/binancespotSlice";
import { binancefutureRedx } from "../components/reduxStore/slice/binancefutureSlice";
import { bitgetFutureRdx } from "../components/reduxStore/slice/bitgetfutureSlice";
// Import the icons
import binanceIcon from "../assets/images/binance-icon-2048x2048-eh77cmwj.png";
import bitgetIcon from "../assets/images/11092.png";
import EditInvestmentModel from "../components/models/EditInvestmentModel";
import Buysellfuturemodal from "../components/models/BuysellFutureModal";
import CloseTradeModal from "../components/models/CloseTradesModal";
import RenderFuturesTable from "../common/RenderFuturesTable";
import RenderAmmTable from "../common/RenderAmmTable";
import HorizantalBalances from "../components/HorizantalBalances";
import VerticalBalances from "../components/VerticalBalance"

const AllDataTable = () => {

  // const location = useLocation();
  const navigate = useNavigate();
  const [btnDisable, setBtnDisable] = useState(false);
  const [loading, setLoading] = useState(false);

  const [botStatus, setBotStatus] = useState("ADD");
  const [toggleRedux, setToggleRedux] = useState(false);
  const [searchData, setSearchData] = useState("");

  const [closeTradeDisable, setCloseTradeDisable] = useState(false);
  const [closeTradeBtn, setCloseTradeBtn] = useState({
    pair: "",
    order_id: "", // Set the pair as the clicked row's symbol
    symbol: "",
    type: "",
  });

  const closeTradeRef = useRef(null);


  const [sortAscending, setSortAscending] = useState(true); // State for sorting direction
  const { fetchData, fetchKeys, formatToExactDecimals } = useFetchKeys();


  // Fetch data from local storage
  const localStorageParams = JSON.parse(localStorage.getItem("allDataTableParams") || "{}");

  const reduxName = toggleRedux
    ? localStorageParams.extraReduxName
    : localStorageParams.reduxName;
  const type = localStorageParams.type;
  const platform = toggleRedux
    ? localStorageParams.extraPlatform
    : localStorageParams.platform;

  const profile = useSelector((state) => state.getProfile?.value?.profile); // Access Redux state

  const Redux = useSelector((state) => state?.[reduxName]?.value);

  const testing = useSelector((state) => state?.selectedTableData);

console.log(testing,"testing")

  const { bots, api_keys } = profile || {};

  const closeRef = useRef(null);
  const modelRef = useRef(null);

  const [data, setData] = useState({
    platform: platform || "BITGET",
    botType: type || "AMM",
    total_investment: "",
  })

  useEffect(() => {
    const fetchDataAsync = async () => {
      const formData = { bot: type, platform: platform };

      // Map reduxName to its respective slice reducer
      const sliceMapping = {
        bitgetSpot: bitgetSpotRedx,
        binanceSpot: binancespotRedx,
        binanceFuture: binancefutureRedx,
        bitgetFuture: bitgetFutureRdx,
      };

      const selectedSlice = sliceMapping[reduxName];

      if (selectedSlice) {
        if (!Redux) {
          await fetchData(formData, setLoading, selectedSlice);


        }
      }

    };

    fetchDataAsync();
  }, [reduxName, type, platform]);




  useEffect(() => {
    if (bots?.[platform]?.[type]?.status === "INACTIVE") {
      setBotStatus("Disable");
    } else if (bots?.[platform]?.[type]?.status === "ACTIVE") {
      setBotStatus("Enable");
    } else {
      setBotStatus("ADD");
    }
  }, [bots, toggleRedux]);



  const { getFormattedDate } = useFetchKeys();

  // Access Redux state
  const getRedux = useSelector((state) => state?.[reduxName]?.value);

  const { usdt_balance } = getRedux || {};

  const formData = { bot: type, platform: platform };

  const sliceMapping = {
    bitgetSpot: bitgetSpotRedx,
    binanceSpot: binancespotRedx,
    binanceFuture: binancefutureRedx,
    bitgetFuture: bitgetFutureRdx,
  };

  const selectedSlice = sliceMapping[reduxName];


  const sortProfit = () => {
    setSortAscending(!sortAscending); // Toggle sorting direction
  };


  // Sort data based on profit
  const sortedData = [...(getRedux?.open_trades || [])].sort((a, b) => {
    const profitA = parseFloat(a.unRealizedProfit || 0);
    const profitB = parseFloat(b.unRealizedProfit || 0);
    return sortAscending ? profitA - profitB : profitB - profitA;
  });



  const getIcon = (platform) => {
    const lowerPlatform = platform?.toLowerCase();
    if (lowerPlatform?.includes("binance")) {
      return binanceIcon;
    } else if (lowerPlatform?.includes("bitget")) {
      return bitgetIcon;
    }
    return null;
  };

  const icon = getIcon(platform);


  const toggleBotStatus = async (e) => {
    e.preventDefault();
    setBtnDisable(true);

    const formattedData = {
      platform: platform,
      bot: type,
      status: bots?.[platform]?.[type]?.status === "INACTIVE" ? "ACTIVE" : "INACTIVE",
    };

    try {
      setBtnDisable(true);
      const response = await backEndCallObj(
        "/admin/change_bot_status",
        formattedData
      );
      toast.success(response?.success);
      const modalInstance = window.bootstrap.Modal.getInstance(modelRef.current);
      if (modalInstance) modalInstance.hide();
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
    } catch (error) {
      toast.error(error?.response?.data || "Error adding bot");
    } finally {
      setBtnDisable(false);
    }
  };

  const handleButtonClick = () => {
    if (bots?.[platform]?.[type]?.status === "INACTIVE" || bots?.[platform]?.[type]?.status === "ACTIVE") {
      // Open confirmDelete modal
      const confirmDeleteModal = new window.bootstrap.Modal(document.getElementById("botChangeModal"));
      confirmDeleteModal.show();
    } else if (api_keys?.[platform]?.api_key) {
      // Open bitgetModal
      const bitgetModal = new window.bootstrap.Modal(document.getElementById("bitgetModal"));
      bitgetModal.show();
    } else {
      // Navigate to /api route with state
      navigate("/api", { state: { platform: platform } });
    }
  };


  const changeDateTimeFormate = (timestamp) => {
    const numericTimestamp = Number(timestamp);

    const date = new Date(numericTimestamp);


    const formattedDate = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`;

    return formattedDate;
  };


  const closeTrade = async () => {
    setCloseTradeDisable(true);

    try {
      let formattedData;
      let response;

      if (type === "FUTURES") {
        formattedData = { pair: closeTradeBtn.pair };

        response = await backEndCallObj("/admin/close_future_coin", formattedData);
        toast.success(response?.success);
      } else {
        formattedData = {
          platform: platform,
          order_id: closeTradeBtn.order_id,
          symbol: closeTradeBtn.symbol,
        };
        response = await backEndCallObj(
          "/trades/cancel_pending_order",
          formattedData
        );
        toast.success(response?.success);
      }

      // Close the modal and clean up
      const modalInstance = window?.bootstrap?.Modal?.getInstance(closeTradeRef?.current);
      if (modalInstance) modalInstance.hide();
      document.querySelector(".modal-backdrop")?.remove();

      // Fetch updated data
      fetchData(formData, setLoading, selectedSlice);
    } catch (error) {
      toast.error(error?.response?.data || "An error occurred");
    } finally {
      setCloseTradeDisable(false);
    }
  };




  return (
    <div className="card">
      <div className="card-body">
        <div className="mb-4">
          <div className="d-flex align-items-center justify-content-between flex-wrap gap-1 my-1 flex-row-reverse">

            <div className="mx-auto d-flex justify-content-center align-items-center flex-wrap overflow-auto gap-md-5 gap-1">

              <span onClick={() => setToggleRedux(!toggleRedux)}><i className="ri-arrow-left-circle-fill fs-5"></i></span>

              <div className="primary-color fw-bold text-capitalize d-flex align-items-center  cursor-pointer custom-font-size mb-0"
                onClick={() => {
                  handleButtonClick();
                }}>

                <div className="d-flex justify-content-between align-items-center ">
                  {icon && (
                    <img
                      src={icon}
                      alt={`${platform} icon`}
                      width={20}
                      height={20}
                      className="crypto-platform-icon me-2"
                    />
                  )}
                  {platform} {type === "FUTURES" ? "FUTURES" : "AMM"} DATA&nbsp;<span className={` custom-font-size ${botStatus === "Disable" ? "text-danger" : "text-success"}`}>({botStatus})</span>
                </div>


              </div>


              {/* <img src={rightArrow} width={50} height={40} alt=""  onClick={()=>setToggleRedux(!toggleRedux)} /> */}
              <span onClick={() => setToggleRedux(!toggleRedux)}><i className="ri-arrow-right-circle-fill fs-5"></i></span>




            </div>
          </div>
        </div>
        {/* <h4 className="primary-color fw-bold text-capitalize text-center">Balances</h4> */}


        <span className="text-uppercase fw-bold text-danger position-absolute top-0 end-0 me-2 cursor-pointer fs-5" onClick={() => navigate("/dashboard", { state: { type, platform } })}>&times;</span>

        {/* capital Assigned & Current Balance */}
        <div className="d-flex justify-content-between align-items-center mb-2">
          <h6
            className="primary-color text-capitalize mb-0 custom-font-size cursor-pointer"
            data-bs-toggle="modal"
            data-bs-target="#editInvest"
          >
            <span>Capital Assigned :</span>
            <span>
              {formatToExactDecimals(parseFloat(getRedux?.total_investment) || 0, 2)}
            </span>            <span className="ms-1">
              <i className="ri-edit-line"></i>
            </span>
          </h6>



          <h6 className="primary-color text-end text-capitalize mb-0 custom-font-size">
            <span>{type === "FUTURES" ? "Current Balance " : "Balance "}: </span>
            <span>
              {formatToExactDecimals(
                parseFloat(
                  type === "FUTURES"
                    ? usdt_balance?.availableBalance || 0
                    : getRedux?.totalBalance || 0
                ),
                2
              )}
            </span>
          </h6>
        </div>

        <Buysellfuturemodal />

        {/* Balances  */}
        <HorizantalBalances type={type} getRedux={getRedux} loading={loading} setLoading={setLoading} platform={platform} selectedSlice={selectedSlice} />

        <div className="d-flex justify-content-between align-items-center  ">

          <form className="formData" onSubmit={(e) => e.preventDefault()}>
            <button>
              <svg width="17" height="16" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="search">
                <path d="M7.667 12.667A5.333 5.333 0 107.667 2a5.333 5.333 0 000 10.667zM14.334 14l-2.9-2.9" stroke="currentColor" strokeWidth="1.333" strokeLinecap="round" strokeLinejoin="round"></path>
              </svg>
            </button>
            <input className="input" placeholder="Type your text" required="" type="text" onChange={(e) => setSearchData(e.target.value)} />
            <button className="reset" type="reset">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </form>

          <div className="my-2 mx-2">
            {/* refresh icon for fetching data again */}
            <i
              className={`fa fa-refresh cursor-pointer fs-20 ${loading ? "rotate-360" : ""}`}
              onClick={() => fetchData(formData, setLoading, selectedSlice)}
            ></i>
          </div>
        </div>


        <div className="row">
          <div className="table-responsive custome-dataTable mt-0 col-12 col-md-9">
            {type === "FUTURES" ? (
              <RenderFuturesTable sortProfit={sortProfit} sortAscending={sortAscending} loading={loading} sortedData={sortedData} bot={type} platform={platform} setLoading={setLoading} selectedSlice={selectedSlice} getRedux={getRedux} setData={setData} searchData={searchData} setCloseTradeBtn={setCloseTradeBtn} />
            ) : type === "AMM" ? (
              <RenderAmmTable sortedData={sortedData} loading={loading} setLoading={setLoading} platform={platform} setData={setData} changeDateTimeFormate={changeDateTimeFormate} searchData={searchData} selectedSlice={selectedSlice} bot={type} setCloseTradeBtn={setCloseTradeBtn} />
            ) : (
              // If type is unknown
              <p className="text-center mb-0">Invalid Data Type</p>
            )}
          </div>
          <div className="col-12 col-md-3 d-none d-md-block">
            <VerticalBalances type={type} getRedux={getRedux} />
          </div>

        </div>

      </div>



      {/* bot status modal */}



      <ConfirmPopup
        label="Bot Status"
        msg={`${botStatus} bot`}
        botStatus={botStatus}
        toggleBotStatus={toggleBotStatus}
        modelRef={modelRef}
        btnDisable={btnDisable}
        id="botChangeModal"
      />







      <EditInvestmentModel
        botType={type}
        platform={platform}
        fetchData={fetchData}
      />

      {/* view modal */}
      <>
        <div
          className="modal fade"
          id="viewModal"
          tabIndex="-1"
          aria-labelledby="viewModalLabel"
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content ">
              <div className="modal-header">
                <h5 className="modal-title primary-color" id="viewModalLabel">
                  View Data
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                {/* Dynamically Render Key-Value Pairs */}
                <div className="row">
                  {Object.entries(data).map(([key, value]) => {
                    // Check if the key is "updatedTime" and apply the date formatting
                    const displayValue =
                      key === "updateTime"
                        ? getFormattedDate(value)
                        : key === "cTime" || key === "uTime"
                          ? changeDateTimeFormate(value)
                          : value;


                    return (
                      <div key={key} className="col-md-6 mb-4">
                        <label className="form-label text-capitalize">
                          {key.replace("_", " ")} {/* Format the key */}
                        </label>
                        <input
                          type="text"
                          value={displayValue || ""}
                          readOnly
                          className="form-control"
                        />
                      </div>
                    );
                  })}
                </div>
              </div>


            </div>
          </div>
        </div>
        <CloseTradeModal
          label="Close Trade"
          msg="Close Trade"
          botStatus="Close"
          toggleBotStatus={closeTrade}
          modelRef={closeTradeRef}
          btnDisable={closeTradeDisable}
          id="closeTradeModalFutures"
        />
      </>

      {/* Add Bot Modal */}

      <div className="modal fade" id="bitgetModal" ref={closeRef}>
        <div className="modal-dialog text-dark modal-dialog-centered">
          <div className="modal-content ">
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
    </div >

  );
};

export default AllDataTable;
