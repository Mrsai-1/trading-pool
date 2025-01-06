import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { backEndCall, backEndCallObj } from "../services/mainService";
import {toast} from "react-toastify";
import { Link } from "react-router-dom";

const Controls = () => {
  const [controlsData, setControlsData] = useState({});
  const unwantedKeys = ["_id", "createdAt", "updatedAt", "__v"];
  const toggleRef = useRef(false); // Ref to prevent multiple clicks
  const [checkToggle, setCheckToggle] = useState(false);

  const [Loading, setLoading] = useState(false);

  useLayoutEffect(() => {

    fetchControlls();
  }, []);


  const fetchControlls = async () => {
    setLoading(true);
    try {
      const data = await backEndCall("/admin_get/get_controls");

      if (data?.success) {
        setControlsData(data.success);


      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
    finally {
      setLoading(false);
    }
  };

  const handleAction = async (control) => {
    // Prevent unnecessary calls if already loading
    if (Loading) return;
    setLoading(true);
    // Directly calculate the new value
    const previousValue = controlsData[control];
    const newValue = !previousValue;
    // Optimistic update
    setControlsData((prevData) => ({
      ...prevData,
      [control]: newValue,
    }));

    const payload = {
      key: control,
      value: newValue,
    };


    try {
      const response = await backEndCallObj("/admin/update_controls", payload);
      if (!response || !response.success) {
        throw new Error("Invalid response from server");
      }
      toast.success(response.success);
      fetchControlls()
    } catch (error) {
      console.error("Error updating control:", error);

      // Revert state on failure
      setControlsData((prevData) => ({
        ...prevData,
        [control]: previousValue, // Revert to the previous value
      }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card controls">
      <div className="card-body">
        <div className="container">
          <div className="mb-4 d-flex justify-content-between align-items-center">
            <Link to="/dashboard">
              <button className="text-uppercase py-1 px-3">back</button>
            </Link>

            <h5 className="mb-0 text-capitalize primary-color fw-bold text-center mb-0">
              admin controls
            </h5>

            <Link to="/cronsetting">
              <p className="fs-14 mb-0 fw-semibold text-capitalize primary-color text-underline-none">
                cron settings
              </p>
            </Link>


          </div>



          <table className="table table-bordered text-center table-striped mb-0">
            <thead className="thead primary-bg">
              <tr>
                <th className="p-3">
                  <p className="mb-0 primary-color fs-14 text-capitalize">
                    admin controls
                  </p>
                </th>
                <th className="p-3">
                  <p className="mb-0 primary-color fs-14 text-capitalize">
                    current status
                  </p>
                </th>
                <th className="p-3">
                  <p className="mb-0 primary-color fs-14 text-capitalize">
                    enable/disable
                  </p>
                </th>
              </tr>
            </thead>
            <tbody className="fs-13">
              {Loading ? (
                // Loading state: Show spinner or placeholder
                <tr>
                  <td colSpan="3">
                    <div className="d-flex justify-content-center align-items-center py-3">
                      <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                      </div>
                    </div>
                  </td>
                </tr>
              ) : Object.keys(controlsData).length > 0 ? (
                // If data exists: Render the table rows
                Object.keys(controlsData)
                  .filter((key) => !unwantedKeys.includes(key))
                  .map((control, index) => (
                    <tr key={index}>
                      <td>
                        <p className="mb-0 fs-13 lh-2 fw-semibold text-capitalize">
                          {control}
                        </p>
                      </td>
                      <td>
                        <p className="mb-0 fs-13 lh-2 fw-semibold text-capitalize">
                          {controlsData[control] ? "Enabled" : "Disabled"}
                        </p>
                      </td>
                      <td>
                        <div
                          className="toggle-switch"
                          // onClick={() => handleAction(control)}
                        >
                          <input
                            className="toggle-input"
                            id={`toggle-${index}`}
                            type="checkbox"
                            checked={controlsData[control]} // Use controlsData[control] directly
                            onChange={() => handleAction(control)} // Pass the control key
                          />
                          <label className="toggle-label" htmlFor={`toggle-${index}`}></label>
                        </div>
                      </td>
                    </tr>
                  ))
              ) : (
                // If no data is found: Show no data message
                <tr>
                  <td colSpan="3" className="text-center">
                    No data found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Controls;
