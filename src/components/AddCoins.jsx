import React, { Suspense, lazy } from "react";
import { MdDelete } from "react-icons/md";
import { RiEdit2Fill } from "react-icons/ri";
import coinService from "../services/CoinServices";
import ConfirmPopup from "./models/ConfirmPopup";
import Joi from "joi-browser";
import Form from "../basic/form";
import { toast } from "react-toastify";
// import UpdateCoins from "./models/UpdateCoins";
import Loader from "../common/Loader";
import { Link } from "react-router-dom";
import MiniLoader from "../common/MiniLoader";
import { connect, useDispatch } from "react-redux";
import { coinListRdx } from "./reduxStore/slice/coinsListSlice";

const UpdateCoins = lazy(() => import("./models/UpdateCoins"));

class AddCoins extends Form {
  constructor(props) {
    super(props);
    this.state = {
      // coinLists: [],
      data: {
        pair: "",
        price_precision: "",
        quantity_precision: "",
        target_percent: "",
        platform: "BINANCE",
        bot: "AMM",
      },
      errors: {},
      btnDisable: false,
      coinDelate: {
        coin_id: "",
        platform: "",
        bot: "",
        pair: "",
        price_precision: "",
        quantity_precision: "",
        target_percent: "",
        divisible: "",
        trade_amount: "",
      },
      modalData: {},
      modalShow: false,
      activeTab: "BINANCE",
      selectedCoinData: "",
      filter: "AMM"
    };
    this.modelRef = React.createRef(null);
    this.closeRef = React.createRef(null);
    this.fetchCoins = this.fetchCoins.bind(this);
    this.handleFilterChange = this.handleFilterChange.bind(this);

  }

  schema = {
    pair: Joi.string().uppercase().required().label("Pair"),
    price_precision: Joi.number()
      .positive()
      .required()
      .label("Price Precision"),
    quantity_precision: Joi.number().required().label("Quantity Precision"),
    target_percent: Joi.number().positive().required().label("Target Percent"),
    platform: Joi.string()
      .valid("BINANCE", "BITGET")
      .required()
      .label("Platform"),
    bot: Joi.string().valid("AMM", "FUTURES").required().label("Bot"),
    divisible: Joi.number().positive().optional(),
    trade_amount: Joi.number().optional(),
  };

  componentDidMount() {
    if (!this.props.coinLists) {
      this.fetchCoins();
    }
  }


  async fetchCoins() {
    this?.setState({ btnDisable: true });
    try {
      const res = await coinService.getCoins();
      this.props.dispatch(coinListRdx(res)); // Dispatch to Redux
      // if (res) this.setState({ coinLists: res });
    } catch (error) {
      console.error("Error fetching coins:", error);
    } finally {
      this.setState({ btnDisable: false });
    }
  }

  // Method to update modal data and show the modal
  handleShowModal = (item) => {
    this.setState({
      modalData: item,
      modalShow: true, // Show the modal
    });

    const modalElement = document.getElementById("updateCoinModal");
    // if (modalElement) {
    const modal = new window.bootstrap.Modal(modalElement);
    modal.show();
  };

  doSubmit = async () => {
    this.setState({ btnDisable: true });
    try {
      const response = await coinService.addCoins(this.state.data);
      if (!response) return;
      toast.success("Coin added successfully!");
      const modalInstance = window.bootstrap.Modal.getInstance(
        this.modelRef.current
      );
      if (modalInstance) modalInstance.hide();
      this.fetchCoins(); // Refresh coin list
      this.state.data = {
        pair: "",
        price_precision: "",
        quantity_precision: "",
        target_percent: "",
        platform: "BINANCE",
        bot: "AMM"
      }
    } catch (error) {
      toast.error(error?.response?.data || "Failed to add coin.");
    } finally {
      this.setState({ btnDisable: false });
    }
  };

  handleDeleteCoins = async () => {
    this.setState({ btnDisable: true });
    try {
      const payload = {
        coin_id: this.state.coinDelate.coin_id,
        status: "DELETE",
        platform: this.state.coinDelate.platform,
        bot: this.state.coinDelate.bot,
        pair: this.state.coinDelate.pair,
        price_precision: this.state.coinDelate.price_precision || 0,
        quantity_precision: this.state.coinDelate.quantity_precision || 0,
        target_percent: this.state.coinDelate.target_percent || 0,
        divisible: this.state.coinDelate.divisible || 0,
        trade_amount: this.state.coinDelate.trade_amount || 0,
      };
      const response = await coinService.deleteCoins(payload);
      toast.success(response.Success);

      if (!response) return;
      const modalInstance = window.bootstrap.Modal.getInstance(
        this.closeRef.current
      );
      if (modalInstance) modalInstance.hide();
      this.fetchCoins(); // Refresh coin list
    } catch (error) {
      toast.error(error?.response?.data);
    } finally {
      this.setState({ btnDisable: false });
    }
  };

  renderTableData = (thData, coins, filter) => {
    const filteredCoins = coins?.filter((item) => item.bot === filter); // Apply the filter condition

    return (
      <div className="table-responsive custom-coinTable">
        <table className="table table-bordered table-striped">
          <thead className="thead primary-bg">
            <tr>
              {thData.map((data, index) => (
                <th key={index} className="text-center">
                  <p className="mb-0 primary-color fs-14 text-capitalize">
                    {data}
                  </p>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="tbody text-center fs-13">
            {this.state.btnDisable ? (
              <tr>
                <td colSpan={thData.length}>
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </td>
              </tr>
            ) : filteredCoins?.length > 0 ? (
              filteredCoins.map((item, index) => (
                <tr key={index}>
                  <td>{item.pair}</td>
                  <td>{item.coin_id}</td>
                  <td>{item.status}</td>
                  <td>{item.price_precision}</td>
                  <td>{item.quantity_precision}</td>
                  <td>{item.target_percent}%</td>
                  <td>{item.platform}</td>
                  <td>{item.bot}</td>
                  <td>
                    <span
                      className="primary-color me-3 cursor-pointer"
                      onClick={() => this.handleShowModal(item)}
                    >
                      <RiEdit2Fill size={18} />
                    </span>
                    <span
                      className="text-danger cursor-pointer"
                      onClick={() => this.setState({ coinDelate: item })}
                      data-bs-toggle="modal"
                      data-bs-target="#confirmDelete"
                    >
                      <MdDelete size={18} />
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={thData.length}>No data found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    );
  };

  handleFilterChange = (event) => {
    this.setState({ filter: event.target.value });
  };

  render() {
    const { coinLists } = this.props;
    const { activeTab } = this.state


 


    const theadData = [
      "pair",
      "coin ID",
      "status",
      "price precision",
      "quantity precision",
      "target percent",
      "platform",
      "bot",
      "action",
    ];

    return (
      <div className="card">
        <div className="card-body">
          <div className="container-lg">
            <div className="d-flex justify-content-between align-items-center">
              <Link to="/dashboard">
                <button className="text-uppercase py-1 px-3">back</button>
              </Link>

              <h5 className="text-center my-3 fw-bold primary-color text-capitalize">
                Add Coins Table
              </h5>

              {/* Add Coin Button */}
              <div className="text-end my-3">
                <button
                  className="py-2 rounded text-capitalize primary-bg fs-13"
                  type="button"
                  data-bs-toggle="modal"
                  data-bs-target="#addCoinModal"
                >
                  Add Coin
                </button>
              </div>
            </div>


            {/* Table */}

            <div className="d-flex justify-content-between align-items center">
              <div className="d-flex gap-2 flex-wrap my-3">
                {[
                  { label: "BINANCE COINS", tabKey: "BINANCE" },
                  { label: "BITGET COINS", tabKey: "BITGET" },
                ].map(({ label, tabKey, coinData }) => (
                  <button
                    key={tabKey}
                    className={`addcoin-btn ${activeTab === tabKey ? "active" : ""}`}
                    onClick={() => this.setState({ activeTab: tabKey })}
                  >
                    {label}
                  </button>
                ))}
              </div>
              <div className="d-flex justify-content-between align-items-center my-3">
                <div className="d-flex gap-2">

                  <select
                    name="filter"
                    value={this.state.filter}
                    onChange={this.handleFilterChange}
                    className="form-select"
                  >
                    <option value="AMM">AMM</option>
                    <option value="FUTURES">FUTURES</option>
                  </select>
                </div>
              </div>
            </div>
            {
              this.state.activeTab === "BINANCE" && this.renderTableData(theadData, coinLists?.binance_coins, this.state.filter)
            }
            {
              this.state.activeTab === "BITGET" && this.renderTableData(theadData, coinLists?.bitget_coins, this.state.filter)
            }

            {/* {
              activeTab === "BINANCE" && renderTableData(theadData , )
            } */}

          </div>
        </div>

        {/* Modals */}
        <Suspense fallback={<MiniLoader />}>
          <ConfirmPopup
            label="Confirm Delete"
            msg={`Delete Coin`}
            botStatus="Delete"
            toggleBotStatus={this.handleDeleteCoins}
            modelRef={this.closeRef}
            btnDisable={this.state.btnDisable}
            id="confirmDelete"
          />

          {/* {this.state.modalShow && ( */}
          <UpdateCoins
            coinList={this.state.modalData}
            fetchCoins={this.fetchCoins}
          />
          {/* )} */}
        </Suspense>

        {/* Add Coin Modal */}
        <div
          className="modal fade"
          id="addCoinModal"
          tabIndex="-1"
          aria-labelledby="addCoinModalLabel"
          ref={this.modelRef}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5
                  className="modal-title primary-color"
                  id="addCoinModalLabel"
                >
                  Add Coin
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body px-4">
                <form onSubmit={this.handleSubmit}>
                  <div className="row">
                    {[
                      { label: "Pair", id: "pair" },
                      { label: "Price Precision", id: "price_precision" },
                      { label: "Quantity Precision", id: "quantity_precision" },
                      { label: "Target Percent", id: "target_percent" },
                      { label: "Divisible", id: "divisible" },
                      { label: "Trade Amount", id: "trade_amount" },
                    ].map((field) => (
                      <div key={field.id} className="col-md-6 mb-4">
                        <label className="form-label">{field.label}</label>
                        <input
                          type="text"
                          name={field.id}
                          value={this.state.data[field.id] || ""}
                          onChange={this.handleChange}
                          className="form-control"
                          placeholder={`Enter ${field.label}`}
                        />
                        {this.state.errors[field.id] && (
                          <div className="text-danger">
                            {this.state.errors[field.id]}
                          </div>
                        )}
                      </div>
                    ))}

                    {/* Platform Select */}
                    <div className="col-md-6 mb-4">
                      <label className="form-label">Platform</label>
                      <select
                        name="platform"
                        value={this.state.data.platform}
                        onChange={this.handleChange}
                        className="form-select"
                      >
                        <option value="BINANCE">BINANCE</option>
                        <option value="BITGET">BITGET</option>
                      </select>
                      {this.state.errors.platform && (
                        <div className="text-danger">
                          {this.state.errors.platform}
                        </div>
                      )}
                    </div>

                    {/* Bot Select */}
                    <div className="col-md-6 mb-4">
                      <label className="form-label">Bot</label>
                      <select
                        name="bot"
                        value={this.state.data.bot}
                        onChange={this.handleChange}
                        className="form-select"
                      >
                        <option value="AMM">AMM</option>
                        <option value="FUTURES">FUTURES</option>
                      </select>
                      {this.state.errors.bot && (
                        <div className="text-danger">
                          {this.state.errors.bot}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="text-end my-4 ">
                    <button
                      type="submit"
                      className="px-3 py-2 rounded"
                      disabled={this.state.btnDisable}
                    >
                      {this.state.btnDisable ? "Submitting..." : "Submit"}
                    </button>
                  </div>
                </form>
              </div>
              {/* <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  data-bs-dismiss="modal"
                >
                  Close
                </button>
              </div> */}
            </div>
          </div>
        </div>
      </div >
    );
  }



}


const mapStateToProps = (state) => {
  return {
    coinLists: state.coinslist.value, // Map specific state data to props
  };
};


export default connect(mapStateToProps)(AddCoins);
