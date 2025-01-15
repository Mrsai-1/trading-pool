import React, { useEffect, useRef, useState, Suspense } from "react";
import { connect, useDispatch } from "react-redux";
import { backEndCall, backEndCallObj } from "../services/mainService";
import Joi from "joi-browser";
import { toast } from "react-toastify";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { profileRedux } from "./reduxStore/slice/profileSlice";
import apidoc1 from "../assets/images/api-doc/api-page1.png";
import apidoc2 from "../assets/images/api-doc/api-page2.png";
// const ConfirmPopup = React.lazy(() => import("./models/ConfirmPopup"));

import ConfirmPopup from "./models/ConfirmPopup";

const Api = ({ getProfile }) => {
  const [data, setData] = useState({});
  const [error, setErrors] = useState({});
  const { api_keys } = getProfile?.profile || {};
  const [btnDisable, setBtnDisable] = useState(false);

  const [apiKeyName, setApiKeyName] = useState("");


  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { platform } = location?.state || {}; //

  const [activeApi, setActiveApi] = useState(platform || "BINANCE");

  const modelRef = useRef(null);


  const schema = {
    api_key: Joi.string().min(30).required(),
    secret_key: Joi.string().min(30).required(),
    passphrase: Joi.string().min(5).when("keys", {
      is: "BITGET",
      then: Joi.required(),
      otherwise: Joi.optional(),
    }),
  };

  useEffect(() => {
    if (!api_keys?.[activeApi.toUpperCase()]) {
      setData({
        api_key: "",
        secret_key: "",
      });
    } else {
      setData({
        api_key: api_keys?.[activeApi.toUpperCase()]?.api_key || "",
        secret_key: "",
      });
    }
  }, [api_keys, activeApi, getProfile]); // Depend on api_keys and activeApi

  const validate = (data) => {
    const result = Joi.validate(data, schema, { abortEarly: false });
    if (!result.error) return null;

    const validationErrors = {};
    for (let item of result.error.details) {
      validationErrors[item.path[0]] = item.message;
    }
    return validationErrors;
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    const fieldSchema = { [id]: schema[id] };
    const result = Joi.validate({ [id]: value }, fieldSchema);
    if (result.error) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [id]: result.error.details[0].message,
      }));
    } else {
      setErrors((prevErrors) => {
        const { [id]: _, ...rest } = prevErrors;
        return rest;
      });
    }

    setData((prevState) => ({
      ...prevState,
      [id]: value,
    }));
  };

  const handleSubmit = async (e, apiType) => {
    e.preventDefault();


    setApiKeyName(apiType);

    const validationErrors = validate(data);
    setErrors(validationErrors || {});
    if (validationErrors) {
      setBtnDisable(false);
      return;
    }


    const modalElement = document.getElementById("confirmDelete");
    // if (modalElement) {
    const modal = new window.bootstrap.Modal(modalElement);
    modal.show();
  };

  const handleConfirm = async () => {
    setBtnDisable(true);
    const formattedData = {
      api_key: data.api_key,
      secret_key: data.secret_key,
      passphrase: data?.passphrase,
      keys: apiKeyName,
      type: api_keys?.[apiKeyName]?.api_key ? "UPDATE" : "ADD",
    };

    try {
      const response = await backEndCallObj(
        "/admin/add_update_keys",
        formattedData
      );
      if (!response) return;
      toast.success(response?.success);

      const keysResponse = await backEndCall("/admin_get/profile");
      const updatedProfile = { ...keysResponse };


      await dispatch(profileRedux(updatedProfile));

      apiKeyName === "BINANCE"
        ? setData({
          api_key:
            updatedProfile?.profile?.api_keys?.[apiKeyName]?.api_key || "",
          secret_key: "",
        })
        : setData({
          api_key:
            updatedProfile?.profile?.api_keys?.[apiKeyName]?.api_key || "",
          secret_key: "",
          passphrase: "",
        });

      navigate("/dashboard")


      const modalInstance = window.bootstrap.Modal.getInstance(
        modelRef.current
      );

      if (modalInstance) modalInstance.hide();
    } catch (error) {
      toast.error(error?.response?.data || "Something went wrong");
    } finally {
      setBtnDisable(false);
    }
  };

  const getButtonLabel = (apiType) => {
    if (btnDisable) return "Please Wait...";
    return api_keys?.[apiType]?.api_key ? "Update" : "Add";
  };

  // Updated renderForm function
  const renderForm = (apiType) => (
    <form className="my-5" onSubmit={(e) => handleSubmit(e, apiType)}>

      <div className="mb-4">
        <label className="form-label text-uppercase fs-15 fw-bold">
          api key
        </label>
        <input
          type="text"
          className="form-control"
          id="api_key"
          placeholder="Enter API key"
          value={data?.api_key || ""}
          onChange={handleChange}
        />
        {error.api_key && (
          <small className="text-danger">{error.api_key}</small>
        )}
      </div>
      <div className="mb-4">
        <label className="form-label text-uppercase fs-15 fw-bold">
          secret key
        </label>
        <input
          type="password"
          className="form-control"
          id="secret_key"
          placeholder="Secret key"
          value={data?.secret_key || ""}
          onChange={handleChange}
        />
        {error.secret_key && (
          <small className="text-danger">{error.secret_key}</small>
        )}
      </div>

      {apiType === "BITGET" && (
        <div className="mb-5">
          <label className="form-label text-uppercase fs-15 fw-bold">
            Passphrase
          </label>
          <input
            type="text"
            className="form-control"
            id="passphrase"
            placeholder="Passphrase"
            value={data?.passphrase || ""}
            onChange={handleChange}
          />
          {error.secret_key && (
            <small className="text-danger">{error.passphrase}</small>
          )}
        </div>
      )}

      <div className="text-end">
        <button className="py-1 me-2 text-capitalize" disabled={btnDisable}>
          {getButtonLabel(apiType)}
        </button>
      </div>

      {/* <Suspense fallback={<div>Loading...</div>}> */}
      {/* <ConfirmPopup toggleBotStatus={handleConfirm}
          botStatus="Confirm" msg={`Change Api Keys in this account ${getProfile?.profile?.user_name}`}
          modelRef={modelRef} /> */}
      <ConfirmPopup
        label="Change Api Keys"
        msg={`Change Api Keys in this account ${getProfile?.profile?.user_name}`}
        botStatus="Confirm"
        toggleBotStatus={handleConfirm}
        modelRef={modelRef}
        btnDisable={btnDisable}
        id="confirmDelete"
      />
      {/* </Suspense> */}
    </form>
  );

  return (
    <div className="api">
      <div className="card">
        <div className="card-body api-card">
          <div className="container">
            <div className="my-4">
              <Link to="/dashboard">
                <button className="text-uppercase py-1 px-3">back</button>
              </Link>
            </div>
            <h5 className="text-center text-uppercase fw-bold mb-5 mt-3 primary-color">
              api settings
            </h5>
            <div className="d-flex gap-2 flex-wrap">
              {["BINANCE", "BITGET"].map((api) => (
                <div
                  key={api}
                  className={`binance-api flex-fill d-flex justify-content-center align-items-center py-2 ${activeApi === api ? "active" : ""
                    }`}
                  onClick={() => setActiveApi(api)}
                >
                  <p className="text-capitalize mb-0 fw-semibold">{api} API</p>
                </div>
              ))}
            </div>
            <>
              {activeApi === "BINANCE"
                ? renderForm("BINANCE")
                : renderForm("BITGET")}
            </>
          </div>


          {
            activeApi === "BINANCE" ? (

              // <div className="card my-3">
              //   <div className="card-body py-5">
              <div className="container">
                {/* documentation */}
                <h5 className="primary-color text-uppercase fw-bold mb-4">
                  API Documentation
                </h5>
                <h6 className="primary-color fw-semibold">
                  How to connect to Binance with API Keys{" "}
                </h6>
                <p className="fs-14">
                  To allow your bot to interact with Binance , you will need to
                  create an API Key. This key acts as a connection between 7LP Bot
                  and the exchange, enabling your bot to perform tasks such as
                  placing automated orders and accessing your balance for its
                  calculations. Essentially, the API Key serves as a way for your
                  bot to communicate with the exchange and execute the actions
                  necessary for automated trading. Step one If you haven't already,
                  go to Binance's website and create an account. Step two Verify
                  your account and get started on the API by navigating to API
                  Management.
                </p>

                <h6 className="primary-color fw-semibold">Step 1</h6>
                <p className="fs-14">
                  If you haven't already, go to Binance's website and create an
                  account.
                </p>
                <div className="text-center">
                  <img src={apidoc1} alt="api-document" className="w-100" />
                </div>
                <h6 className="primary-color fw-semibold">Step 2</h6>
                <p className="fs-14">
                  Verify your account and get started on the API by navigating to
                  API Management.
                </p>
                <h6 className="primary-color fw-semibold">Step 3</h6>
                <p className="fs-14">
                  Click on “Create API”, select “System generated API Key” and click
                  on Next.
                </p>
                <h6 className="primary-color fw-semibold">Step 4</h6>
                <p className="fs-14">
                  Start by naming the API something memorable such as “7LP API”.
                  Your API Key and secret are now created, but they cannot be used
                  for trading yet. To enhance the security of your funds on Binance,
                  you must whitelist the IP (“13.234.42.140”)addresses of 7LP
                  servers in your API Key settings. This will allow only 7LP servers
                  to perform actions on your Binance account, preventing any
                  unauthorized third parties from accessing it, even if your API
                  Keys are compromised. By following this step, you can ensure that
                  your funds remain safe while trading
                </p>
                <div className="text-center">
                  <img src={apidoc2} alt="api-document" className="w-100" />
                </div>
                <p className="fs-14">
                  To enable trading, click on "Edit" and check the box next to
                  "Enable spot & Margin Trading." No other API restrictions need to
                  be enabled, and 7LP will never ask for "Withdrawal" or "Universal
                  Transfer" rights. Do not click "Save" yet, as there is one more
                  step to complete.
                </p>
                <p className="fs-14">
                  Copy the API Keys shown on Binance and paste them into 7LP. Then,
                  save the changes on both Binance and 7LP. Allow a moment for the
                  bot to link everything together, and your balance should become
                  visible.
                </p>
              </div>
              //   </div>
              // </div>

            ) : (
              <div className="card my-3">
                <p className="text-center fw-bold p-3">No documentation available for BITGET API</p>
              </div>
            )

          }

        </div>
      </div>
    </div>
  );
};

// Map Redux state to props
const mapStateToProps = (state) => ({
  getProfile: state.getProfile.value, // Access the slice state
});

export default connect(mapStateToProps)(Api);
