import React, { Component } from "react";

class CloseTradeModal extends Component {
  handleSubmit = (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    const { toggleBotStatus } = this.props;
    toggleBotStatus(e); // Call the toggle function passed via props
  };

  render() {
    const { label, msg, botStatus, modelRef, btnDisable, id } = this.props;
// console.log(modelRef)
    return (
      <div className="modal fade" id={id}  ref={modelRef}>
        <div className="modal-dialog text-dark modal-dialog-centered">
          <div className="modal-content">
            {/* Modal Header */}
            <div className="modal-header">
              <h5 className="modal-title primary-color">{label || "Confirm Action"}</h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
              ></button>
            </div>

            {/* Modal Body */}
            <div className="modal-body text-center">
              <p className="mb-0">Are you sure you want to {msg || "proceed"}?</p>
            </div>

            {/* Modal Footer with Form */}
            <form onSubmit={this.handleSubmit}>
              <div className="modal-footer">
                <div className="d-flex justify-content-between w-100 align-items-center">
                  {/* No/Cancel Button */}
                  <button
                    type="button"
                    className="px-4 py-1 rounded btn btn-success"
                    data-bs-dismiss="modal"
                  >
                    No
                  </button>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="px-4 py-1 rounded btn btn-danger"
                    disabled={btnDisable}
                  >
                    {btnDisable ? "Wait..." : botStatus}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

export default CloseTradeModal;
