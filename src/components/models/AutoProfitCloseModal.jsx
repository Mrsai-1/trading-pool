import React from "react";
import { toast } from "react-toastify";
import coinService from "../../services/CoinServices";
import Joi from "joi-browser";
import Form from "../../basic/form";
import { backEndCallObj } from "../../services/mainService";
import { coinListRdx } from "../reduxStore/slice/coinsListSlice";
import { connect } from "react-redux";

class AutoProfitCloseModal extends Form {
  constructor(props) {
    super(props);
    this.state = {
      data: {
        platform: "",
        pair: "",
        expected_profit: "",
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
      expected_profit: Joi.number().positive().required(),

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
    this.setState({ data });
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
        profit: this.state.data.expected_profit,
      };
      console.log(formattedData)

      const response = await backEndCallObj("/admin/add_update_take_profit",formattedData);

      // Show success toast
      toast.success(response?.success || "Profit Set Successfully");

      const modalInstance = window.bootstrap.Modal.getInstance(this.modelRef.current);
      if (modalInstance) modalInstance.hide();

      // Reset modal or form fields
      this.setState({
        data: { platform: "", pair: "", amount_in_usdt: "" },
        errors: {},
      });
    } catch (error) {
      toast.error(error?.response?.data || "Failed to set Profit.");
    } finally {
      this.setState({ btnDisable: false });
    }
  };

componentDidMount(){
  const {current_pair, platform} = this.props
  this.setState({
    data: {
      platform: platform,
      pair: current_pair,
      expected_profit: "",
    },
  });
}
 


  componentDidUpdate(prevProps) {
    const { current_pair, platform } = this.props;
  
    const updatedData = {};
  
    if (prevProps.current_pair !== current_pair) {
      updatedData.pair = current_pair;
    }
  console.log(prevProps.platform, platform)
    if (prevProps.platform !== platform) {
      updatedData.platform = platform;
    }
  console.log(updatedData)
    if (Object.keys(updatedData).length > 0) {
      this.setState((prevState) => ({
        data: {
          ...prevState.data,
          ...updatedData,
        },
      }));
    }
  }
  
  
  

  render() {
    const { data, errors, btnDisable } = this.state;
    const {current_pair} = this.props
console.log(errors)
console.log(current_pair , data)
    return (
      <div
        className="modal fade"
        id="autoprofitclosemodal"
        tabIndex="-1"
        aria-labelledby="buysellfuturemodal"
        ref={this.modelRef}
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content ">
            <div className="modal-header">
              <h5 className="modal-title primary-color" id="addCoinModalLabel">
               Auto Profit Close
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

                  <div className="col-md-6 mb-2 w-100">
                    <label className="form-label">Pair</label>
                    <input
                      type="text"
                      name="pair"
                      value={current_pair || ""}
                      onChange={this.handleChange}
                      className="form-control mb-2"
                      autoComplete="off"
                    />
                    {errors.pair && (
                      <div className="text-danger">{errors.pair}</div>
                    )}

                    <label className="form-label">Enter Profit</label>
                    <input
                      type="text"
                      name="expected_profit"
                      value={data.expected_profit}
                      onChange={this.handleChange}
                      className="form-control"
                      autoComplete="off"
                      pattern="[0-9]*" 
                      inputMode="numeric" 
                    />
                    {errors.expected_profit && (
                      <div className="text-danger">{errors.expected_profit}</div>
                    )}

                  
                  </div>
                </div>
               

                <div className="d-flex justify-content-between my-4 ">
                  <button
                    type="submit"
                    className="px-3 py-2 rounded"
                    disabled={btnDisable}
                    onClick={this.ModalSubmit}
                
                  >
                    {btnDisable ? "wait..." : "Submit"}
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



export default (AutoProfitCloseModal);
