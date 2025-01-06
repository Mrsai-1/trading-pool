import React from "react";
import Joi from "joi-browser";
import Form from "../../basic/form";
import { backEndCallObj } from "../../services/mainService";
import { toast } from "react-toastify";
import { binancefutureRedx } from "../reduxStore/slice/binancefutureSlice";
import { connect } from "react-redux";

class EditBinanceFuture extends Form {
    // Validation Schema
    schema = {
        platform: Joi.string().valid("BINANCE", "BITGET").required(),
        botType: Joi.string().valid("AMM", "FUTURES").required(),
        invest: Joi.number().positive().required(),
    };

    constructor(props) {
        super(props);
        this.state = {
            data: {
                invest: "", // Prepopulate with initial value
                botType: props.botType || "",
                platform: props.platform || "",
            },
            errors: {},
            btnDisable: false, // State to manage button disable status
        };
        this.modelRef = React.createRef(null);
    }



    // Handle Submit Logic
    doSubmit = async () => {
        const { data } = this.state;
        this.setState({ btnDisable: true }); // Disable submit button during submission

        try {
            const formattedData = {
                bot: data.botType,
                platform: data.platform,
                total_investment: data.invest,
            };

            const formData = {
                bot: data.botType,
                platform: data.platform,
            };

            // API call to submit edited investment
            const response = await backEndCallObj("/admin/update_investment", formattedData);

            // Show success toast
            toast.success(response?.success || "Investment updated successfully");

            const modalInstance = window.bootstrap.Modal.getInstance(this.modelRef.current);
            if (modalInstance) modalInstance.hide();
            // Dispatch the Redux action to update the state
            this.props.fetchData(formData, this.updateDisableButton, binancefutureRedx)
            // this.props.dispatch(binancefutureRedx(response));

            // Reset modal or perform callback if necessary
            this.setState({ data: { invest: "", botType: "" } }); // Clear form fields
            if (this.props.onSuccess) this.props.onSuccess(); // Optional callback
        } catch (error) {
            // Handle errors
            console.error("Error updating investment: ", error);
            toast.error(error?.response?.data || "Error updating investment");
        } finally {
            this.setState({ btnDisable: false }); // Re-enable the submit button
        }
    };


    updateDisableButton = () => {
        this.setState({ btnDisable: true }); // Disable submit button during submission
    }

    render() {
        const { data, errors, btnDisable } = this.state;


        return (
            <div className="modal fade" id="editBinanceFutureModal" tabIndex="-1" aria-hidden="true" ref={this.modelRef}>
                <div className="modal-dialog text-dark modal-dialog-centered">
                    <div className="modal-content ">
                        {/* Modal Header */}
                        <div className="modal-header">
                            <h4 className="modal-title">Edit Capital Assign</h4>
                            <button
                                type="button"
                                className="btn-close"
                                data-bs-dismiss="modal"
                                aria-label="Close"
                            ></button>
                        </div>

                        {/* Modal Body */}
                        <div className="modal-body">
                            <form onSubmit={this.handleSubmit}>
                                {/* Input Field */}
                                <div className="d-flex flex-column-reverse my-4">
                                    <input
                                        className="inputField px-2"
                                        type="number"
                                        name="invest"
                                        id="invest"
                                        value={data.invest}
                                        placeholder="Edit Investment"
                                        onChange={this.handleChange}
                                        required
                                    />
                                    <label htmlFor="invest" className="inputLabel">
                                        Capital Assign
                                    </label>
                                    {errors.invest && (
                                        <p className="fs-13 text-danger">{errors.invest}</p>
                                    )}
                                </div>
                                <div className="modal-footer">
                                    <div className="d-flex justify-content-center w-100 align-items-center">
                                        <button
                                            type="submit"
                                            className="btn btn-success"

                                            disabled={btnDisable} // Disable button during submission
                                        >
                                            {btnDisable ? "Submitting..." : "Submit"}
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>

                        {/* Modal Footer */}

                    </div>
                </div>
            </div>
        );
    }
}

const mapDispatchToProps = (dispatch) => ({
    dispatch, // Make dispatch available as a prop
  });
  

export default connect(null, mapDispatchToProps)(EditBinanceFuture); ;
