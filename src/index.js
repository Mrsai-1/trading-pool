import React from "react";
import ReactDOM from "react-dom/client";
import "./index.scss";
import App from "./App";
import { Provider } from "react-redux";
import store from "./components/reduxStore/store/store";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import toastify styles



const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  // <React.StrictMode>

  <Provider store={store}>
    {/* <CotextTest> */}
      <App />
    {/* </CotextTest> */}
  </Provider>

  // </React.StrictMode>
);
