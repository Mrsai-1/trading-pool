import React, { Component } from "react";

class ConfirmPopup extends Component {

  
  render() {
    const { label, msg, botStatus, toggleBotStatus, modelRef, btnDisable ,id } =
      this.props;

      


    return (
      <>
        <div className="modal fade" id={id} ref={modelRef}>
          <div className="modal-dialog text-dark modal-dialog-centered">
            <div className="modal-content ">
              <div className="modal-header">
                <h5 className="modal-title primary-color">
                  {label || "Delete"}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                ></button>
              </div>

              <div className="modal-body text-center">
                <p className="">Are you sure you want to {msg || "delete"}?</p>
              </div>

              <div className="modal-footer">
                <div className="d-flex justify-content-between w-100 align-items center">
                  <button
                    type="button"
                    className="px-4 py-1 rounded btn btn-success"
                    data-bs-dismiss="modal"
                  >
                    No
                  </button>
                  <button
                    className="px-4 py-1 rounded"
                    onClick={(e) => {
                      toggleBotStatus(e);
                    }}
                    disabled={btnDisable}
                  >
                    {btnDisable ? "Wait..." : botStatus}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}

export default ConfirmPopup;
