import React from "react";
import { backEndCallObj } from "../services/mainService";
import Form from "../basic/form"; // Import the base class
import Joi from "joi-browser";
import {toast} from "react-toastify";

class DisableAllCoins extends Form {
  constructor(props) {
    super(props);
    // Initialize form data and schema for this specific component
    this.state = {
      data: {
        platform: "",
        bot: "",
        status: "",
      },
      errors: {},
      btnDisable: false,
    };

    this.schema = {
      platform: Joi.string().valid("BINANCE", "BITGET").required(),
      bot: Joi.string().valid("AMM", "FUTURES").required(),
      status: Joi.string().valid("ACTIVE", "INACTIVE").required(),
    };
  }

  // Override handleSubmit function if you need custom logic
  doSubmit = async () => {
    const { data ,errors } = this.state;

    this.setState({ btnDisable: true });
    try {
      const response = await backEndCallObj("/admin/enable_disable_all_coins", data);
        toast.success(response.success);
    } catch (error) {
      toast.error(error.message || "Error occurred while disabling coins.");
    } finally {
      this.setState({ btnDisable: false });
    }
  };

  // Helper Functions for Rendering
  renderSelect = (label, name, options) => {
    const { data, errors } = this.state;
    return (
      <div className="mb-3">
        <label className="form-label">{label}</label>
        <select
          className="form-control"
          name={name}
          value={data[name]}
          onChange={this.handleChange}
        >
          {options.map((option) => (
            <option key={option.id} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {errors[name] && <div className="text-danger">{errors[name]}</div>}
      </div>
    );
  };

  renderButton = (label, className) => {
    const { btnDisable } = this.state;
    return (
      <div className="text-end">
        <button className={className} disabled={btnDisable}>
        {btnDisable ? "wait" : label}
        </button>
      </div>
    );
  };

  render() {
    const { btnDisable } = this.state;
    return (
     <>
      <div className="card shadow-sm border-0">
        <div className="card-header text-center primary-bg">
          <p className="mb-0 fw-bold fs-15 text-capitalize">
            Disable all coins
          </p>
        </div>
        <div className="card-body px-4">
          <form className="form" onSubmit={this.handleSubmit}>
            <div className="text-start mb-4">
              {this.renderSelect("Platform", "platform", [
                { id: "selectoption", value: "", label: "-- Select --" },
                { id: "binance", value: "BINANCE", label: "Binance" },
                { id: "bitget", value: "BITGET", label: "Bitget" },
              ])}
            </div>
            <div className="text-start mb-4">
              {this.renderSelect("Bot", "bot", [
                { id: "selectoption", value: "", label: "-- Select --" },
                { id: "amm", value: "AMM", label: "SPOT" },
                { id: "futures", value: "FUTURES", label: "Futures" },
              ])}
            </div>
            <div className="text-start mb-4">
              {this.renderSelect("Status", "status", [
                { id: "selectoption", value: "", label: "-- Select --" },
                { id: "active", value: "ACTIVE", label: "ACTIVE" },
                { id: "inactive", value: "INACTIVE", label: "INACTIVE" },
              ])}
            </div>
            {this.renderButton("Disable", "mt-3 px-3 py-2 rounded")}
          </form>
        </div>
      </div>
     </>
    );
  }
}

export default DisableAllCoins;
