import React from "react";
import { toast } from "react-toastify";
import coinService from "../../services/CoinServices";
import Joi from "joi-browser";
import Form from "../../basic/form";

class UpdateCoins extends Form {

  constructor(props) {
    super(props);
    this.state = {
      data: {
        coin_id: "",
        status: "",
        platform: "BINANCE",
        bot: "AMM",
        pair: "",
        price_precision: "",
        quantity_precision: "",
        target_percent: "",
        divisible: "",
        trade_amount: "",
      },
      errors: {},
      btnDisable: false,
    };
    this.modelRef = React.createRef();
  }

  schema = {
    coin_id: Joi.string().required().label("Coin ID"),
    status: Joi.string()
      .valid("ACTIVE", "INACTIVE", "DELETE")
      .required()
      .label("Status"),
    platform: Joi.string()
      .valid("BINANCE", "BITGET")
      .required()
      .label("Platform"),
    bot: Joi.string().valid("AMM", "FUTURES").required().label("Bot"),
    pair: Joi.string().required().label("Pair"),
    price_precision: Joi.number()
      .required()
      .label("Price Precision"),
    quantity_precision: Joi.number()
      .required()
      .label("Quantity Precision"),
    target_percent: Joi.number().required().label("Target Percent"),
    divisible: Joi.string().required().label("Divisible"),
    trade_amount: Joi.number().required().label("Trade Amount"),
  };

  doSubmit = async () => {
    this.setState({ btnDisable: true });
    try {
      const response = await coinService.updateCoins(this.state.data);
      toast.success(response.Success || "Coin updated successfully!");
      if (!response) return;
      const modalInstance = window.bootstrap.Modal.getInstance(this.modelRef.current);
      if (modalInstance) modalInstance.hide();
      this.props.fetchCoins();
    } catch (error) {
      toast.error(error?.response?.data || "Failed to update coin.");
    } finally {
      this.setState({ btnDisable: false });
    }
  };


  componentDidUpdate(prevProps) {
    if (prevProps.coinList !== this.props.coinList) {
      const coin = this.props.coinList || {};
      // Check if the state needs updating to prevent unnecessary re-renders
      if (coin.coin_id !== this.state.data.coin_id) {
        this.setState(
          {
            data: {
              coin_id: coin.coin_id || "",
              status: coin.status || "",
              platform: coin.platform || "BINANCE",
              bot: coin.bot || "AMM",
              pair: coin.pair || "",
              price_precision: JSON.stringify(coin.price_precision )|| 0,
              quantity_precision: JSON.stringify(coin.quantity_precision) || 0,
              target_percent: JSON.stringify(coin.target_percent) || "",
              divisible: JSON.stringify(coin.divisible) || "",
              trade_amount: JSON.stringify(coin.trade_amount) || 0,
            },
          },
          () => {
          }
        );
      }
    }
  }



  render() {
    const { data, errors, btnDisable } = this.state;

    return (
      <div
        className="modal fade"
        id="updateCoinModal"
        tabIndex="-1"
        aria-labelledby="addCoinModalLabel"
        ref={this.modelRef}
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content ">
            <div className="modal-header">
              <h5 className="modal-title primary-color" id="addCoinModalLabel">
                Update Coin
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <form onSubmit={this.handleSubmit}>
                <div className="row">
                  <div className="col-md-6 mb-4">
                    <label className="form-label">Status</label>
                    <select
                      name="status"
                      value={data.status}
                      onChange={this.handleChange}
                      className="form-control"
                    >
                      <option value="ACTIVE">Active</option>
                      <option value="INACTIVE">Inactive</option>
                    </select>
                    {errors.status && (
                      <div className="text-danger">{errors.status}</div>
                    )}
                  </div>
                  {/* <div className="col-md-6 mb-4">
                    <label className="form-label">Coin ID</label>
                    <input
                      type="text"
                      name="coin_id"
                      value={data.coin_id}
                      onChange={this.handleChange}
                      className="form-control"
                      placeholder="Enter Coin ID"
                    />
                    {errors.coin_id && (
                      <div className="text-danger">{errors.coin_id}</div>
                    )}
                  </div> */}
                  {/* Other fields */}
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
                        value={data[field.id] || ""}
                        onChange={this.handleChange}
                        className="form-control"
                        placeholder={`Enter ${field.label}`}
                      />
                      {errors[field.id] && (
                        <div className="text-danger">{errors[field.id]}</div>
                      )}
                    </div>
                  ))}

                  {/* Platform Select */}
                  <div className="col-md-6 mb-4">
                    <label className="form-label">Platform</label>
                    <select
                      name="platform"
                      value={data.platform}
                      onChange={this.handleChange}
                      className="form-select"
                    >
                      <option value="BINANCE">BINANCE</option>
                      <option value="BITGET">BITGET</option>
                    </select>
                    {errors.platform && (
                      <div className="text-danger">{errors.platform}</div>
                    )}
                  </div>

                  {/* Bot Select */}
                  <div className="col-md-6 mb-4">
                    <label className="form-label">Bot</label>
                    <select
                      name="bot"
                      value={data.bot}
                      onChange={this.handleChange}
                      className="form-select"
                    >
                      <option value="AMM">SPOT</option>
                      <option value="FUTURES">FUTURES</option>
                    </select>
                    {errors.bot && (
                      <div className="text-danger">{errors.bot}</div>
                    )}
                  </div>
                </div>
                <div className="text-end my-4 ">
                  <button
                    type="submit"
                    className="px-3 py-2 rounded"
                    disabled={btnDisable}
                  >
                    {btnDisable ? "Submitting..." : "Submit"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default UpdateCoins;
