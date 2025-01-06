import React from "react";
import { toast } from "react-toastify";
import coinService from "../../services/CoinServices";
import Joi from "joi-browser";
import Form from "../../basic/form";
import { backEndCallObj } from "../../services/mainService";
import { coinListRdx } from "../reduxStore/slice/coinsListSlice";
import { connect } from "react-redux";

class Buysellfuturemodal extends Form {
  constructor(props) {
    super(props);
    this.state = {
      data: {
        platform: "BINANCE",
        pair: "",
        amount_in_usdt: "",
      },
      errors: {},
      btnDisable: false,
      side: "",
      // coinLists: [],
    };
    this.modelRef = React.createRef(); // Create a reference to the modal
  }

  schema = {
    platform: Joi.string().valid("BINANCE", "BITGET").required(),
    pair: Joi.string().uppercase().required(),
    amount_in_usdt: Joi.number().positive().required(),
  };
  setErrors = (field, message) => {
    this.setState(
      (prevState) => ({
        errors: {
          ...prevState.errors,
          [field]: message,
        },
      })
    );
  };

  validate = () => {
    const options = { abortEarly: false };
    const { error } = Joi.validate(this.state.data, this.schema, options);
    const errors = {};

    // Add Joi validation errors
    if (error) {
      for (let item of error.details) errors[item.path[0]] = item.message;
    }

    // Preserve any existing custom errors (like pair validation)
    if (this.state.errors.pair) {
      errors.pair = this.state.errors.pair;
    }

    return Object.keys(errors).length === 0 ? null : errors;
  };

  handleChange = ({ currentTarget: input }) => {
    const data = { ...this.state.data };
    data[input.name] = input.value;

    // Custom pair validation
    if (input.name === "pair") {
      // const { coinLists } = this.props;
      // const pairExists = coinLists.binance_coins.some(
      //   (item) => item.pair === input.value.toUpperCase()
      // );

      const { coinLists } = this.props;

      // Convert the input value to uppercase for comparison
      const inputValue = input.value.toUpperCase();

      // Check if the pair exists in binance_coins
      const binancePairExists = coinLists.binance_coins.some(
        (item) => item.pair === inputValue
      );

      // Check if the pair exists in bitget_coins
      const bitgetPairExists = coinLists.bitget_coins.some(
        (item) => item.pair === inputValue
      );

      // Combine the results
      const pairExists = binancePairExists || bitgetPairExists;


      if (!pairExists) {
        this.setErrors("pair", "Invalid pair. Please select a valid coin pair.");
      } else {
        this.setErrors("pair", ""); // Clear custom pair error if valid
      }
    }

    this.setState({ data });
  };

  setErrors = (field, message) => {
    this.setState((prevState) => ({
      errors: {
        ...prevState.errors,
        [field]: message,
      },
    }));
  };

  ModalSubmit = async (e) => {
    if (e) e.preventDefault();

    const errors = this.validate(); // Run validation
    this.setState({ errors: errors || {} });
    if (errors) return; // Stop submission if errors exist

    this.setState({ btnDisable: true });
    try {
      const formattedData = {
        platform: this.state.data.platform,
        pair: this.state.data.pair,
        amount_in_usdt: this.state.data.amount_in_usdt,
        side: this.state.side,
      };

      const response = await backEndCallObj("/admin/buy_sell_future_coin", formattedData);

      // Show success toast
      toast.success(response?.success || "buy/sell successfully");

      const modalInstance = window.bootstrap.Modal.getInstance(this.modelRef.current);
      if (modalInstance) modalInstance.hide();

      // Reset modal or form fields
      this.setState({
        data: { platform: "BINANCE", pair: "", amount_in_usdt: "" },
        errors: {},
        side: "",
      });
    } catch (error) {
      toast.error(error?.response?.data || "Failed to update coin.");
    } finally {
      this.setState({ btnDisable: false });
    }
  };


  componentDidMount() {
    if (!this.props.coinLists) {
      this.fetchCoins();
    }
  }

  async fetchCoins() {
    try {
      const res = await coinService.getCoins();
      this.props.dispatch(coinListRdx(res)); // Dispatch to Redux
    } catch (error) {
      console.error("Error fetching coins:", error);
    }
  }

  render() {
    const { data, errors, btnDisable } = this.state;

    const { coinLists } = this.props;


    return (
      <div
        className="modal fade"
        id="buysellfuturemodal"
        tabIndex="-1"
        aria-labelledby="buysellfuturemodal"
        ref={this.modelRef}
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content ">
            <div className="modal-header">
              <h5 className="modal-title primary-color" id="addCoinModalLabel">
                Buy / Sell Coins
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <form onSubmit={this.ModalSubmit}>
                <div className="row">

                  <div className="col-md-6 mb-4">
                    <label className="form-label">Pair</label>
                    <input
                      type="text"
                      name="pair"
                      value={data.pair}
                      onChange={this.handleChange}
                      className="form-control"
                      placeholder="Enter pair"
                      list='list-timezone'
                      id='input-datalist'
                      autoComplete="off"
                    />
                    {errors.pair && (
                      <div className="text-danger">{errors.pair}</div>
                    )}

                    <datalist id="list-timezone">
                      {[
                        ...(coinLists?.binance_coins || []), // Ensure it's an array even if undefined
                        ...(coinLists?.bitget_coins || []), // Combine both arrays
                      ]
                        ?.filter((item) => item.bot === "FUTURES") // Filter FUTURES only
                        .map((filteredItem) => (
                          <option key={filteredItem.pair}>{filteredItem.pair}</option> // Render options
                        ))}
                    </datalist>
                  </div>

                  {[
                    { label: "Amount in USDT", id: "amount_in_usdt" },
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
                </div>
                <div className="col-md-6 mb-4">
                  <label className="form-label">Platform</label>
                  <select
                    name="platform"
                    value={data.platform}
                    onChange={this.handleChange}
                    className="form-control"
                  >
                    <option value="BINANCE">BINANCE</option>
                    <option value="BITGET">BITGET</option>
                  </select>
                  {errors.platform && (
                    <div className="text-danger">{errors.platform}</div>
                  )}
                </div>

                <div className="d-flex justify-content-between my-4 ">
                  <button
                    type="submit"
                    className="px-3 py-2 rounded"
                    disabled={btnDisable}
                    onClick={() => this.setState({ side: "BUY" })}
                  >
                    {btnDisable ? "wait..." : "Buy"}
                  </button>
                  <button
                    type="submit"
                    className="px-3 py-2 rounded"
                    disabled={btnDisable}
                    onClick={() => this.setState({ side: "SELL" })}
                  >
                    {btnDisable ? "wait..." : "Sell"}
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

const mapStateToProps = (state) => {
  return {
    coinLists: state.coinslist.value, // Map specific state data to props
  };
};

export default connect(mapStateToProps)(Buysellfuturemodal);
