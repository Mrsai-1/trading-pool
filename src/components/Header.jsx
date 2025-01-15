import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getCurrentUser } from "../services/mainService";
import { useDispatch, useSelector } from "react-redux";
import mainLogo from "../assets/images/7pools-logo.png";
import profileImg from "../assets/images/149071.png";
import { FaPowerOff } from "react-icons/fa";
import { AiFillControl, AiFillApi } from "react-icons/ai";
import { FaBitcoin } from "react-icons/fa";
import useFetchKeys from "../common/CotextTest";

const Header = () => {


  const dispatch = useDispatch();
  const profile = useSelector((state) => state?.getProfile?.value?.profile); // Access Redux state

  const { fetchKeys } = useFetchKeys();

  const currentUser = getCurrentUser();



  // Theme Toggle Handler
  const handleTheme = () => {
    document.body.classList.toggle("dark");
  };


  // Fetch profile and API keys

  useEffect(() => {
    fetchKeys();
  }, [dispatch]);


  // Logout Handler
  const LogoutHandler = () => {
    localStorage.clear();
    localStorage.removeItem("k-token");
    window.location.href = "/";
  };

  return (
    <div className="header p-2">
      <div className="card">
        <div className="card-body py-2 px-2 px-md-4">
          <div className="d-flex justify-content-between align-items-center flex-wrap">
            <div className="d-flex gap-5 flex-wrap">
              <div className="d-flex gap-3 align-items-center">
                <Link to="/dashboard">
                  <img src={mainLogo} alt="7pools-logo" width={110} className="header-logo"/>
                </Link>
                {/* <h5
                  className="mb-0 text-uppercase fw- d-flex align-items-center"
                  style={{ fontWeight: "900" }}
                >
                  trading bot
                </h5> */}
              </div>
            </div>

            <div className="ms-auto d-flex column-gap-2 align-items-center">
              <div className="d-none">
                <h6 className="text-capitalize primary-color">bot status</h6>
                <div className="d-flex align-items-center gap-2">
                  <p className="mb-0 flex-fill text-capitalize fs-13">
                    binance
                  </p>
                  <progress
                    className="custom-progress"
                    max="100"
                    value="90"
                  ></progress>
                </div>
                <div className="d-flex align-items-center gap-2">
                  <p className="mb-0 flex-fill text-capitalize fs-13">bitget</p>
                  <progress
                    className="custom-progress bitget-progress"
                    max="100"
                    value="60"
                  ></progress>
                </div>
              </div>

              <div className="dropdown border-0  px-2 py-1">
                <div
                  className="dropdown-toggle d-flex align-items-center justify-content-end"
                  type="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <div className="profile-wrapper me-2">
                    <img
                      src={profile?.img_url || profileImg}
                      alt="user-profile"
                      onError={(e) => {
                        e.target.onerror = null; // Prevents infinite loop in case fallback image also fails
                        e.target.src = "../assets/images/149071.png"; // Fallback image
                      }}
                    />
                  </div>

                  {/* <span className="fs-13 text-muted fw-bold">Pavan Rebba</span> */}
                  <div className="me-2 d-none d-sm-block profile-dropdown">
                    <p className="mb-0 fs-14 fw-semibold text-capitalize">
                      {" "}
                      {profile?.user_name}
                    </p>
                    <p className="mb-0 fs-13 text-secondary">
                      {profile?.user_email}
                    </p>
                  </div>
                </div>
                <ul className="dropdown-menu border-0 shadow-lg px-3">
                  <li>
                    <div className="d-flex gap-2 px-3 border-bottom py-2">
                      <div className="profile-wrapper">
                        <img src={profileImg} alt="user-profile" />
                      </div>
                      <div>
                        <p className="mb-0 fs-14 fw-semibold">
                          {profile?.user_name}
                        </p>
                        <p className="mb-0 fs-13 text-secondary">
                          {profile?.user_email}
                        </p>
                      </div>
                    </div>
                  </li>
                  <li className="pt-2">
                    <Link to="/api" className="dropdown-item text-secondary">
                      <span className="me-2">
                        <AiFillApi size={17} />
                      </span>
                      <span className="fs-14 fw-semibold">API</span>
                    </Link>
                  </li>
                  {currentUser?.user_type === "ADMIN" ? (
                    <>
                      <li>
                        <Link
                          to="/addcoins"
                          className="dropdown-item text-secondary"
                        >
                          <span className="me-2">
                            <FaBitcoin size={17} />
                          </span>
                          <span className="fs-14 fw-semibold">Add Coins</span>
                        </Link>
                      </li>
                      <li className="pb-2">
                        <Link
                          to="/controls"
                          className="dropdown-item text-secondary"
                        >
                          <span className="me-2">
                            <AiFillControl size={17} />
                          </span>
                          <span className="fs-14 fw-semibold">
                            Admin Controls
                          </span>
                        </Link>
                      </li>
                    </>
                  ) : (
                    ""
                  )}

                  {/* <li className="text-center py-2">
                    <Link
                      to="/makeadmin"
                      className="dropdown-item text-secondary"
                    >
                      <span className="me-2">
                        <FaPowerOff size={15} />
                      </span>
                      <span className="fs-14 fw-semibold">Make User/Admin</span>
                      a
                    </Link>
                  </li> */}

                  <li className="border-top text-center py-2">
                    <div
                      onClick={LogoutHandler}
                      className="dropdown-item text-secondary"
                    >
                      <span className="me-2">
                        <FaPowerOff size={15} />
                      </span>
                      <span className="fs-14 fw-semibold">Logout</span>
                    </div>
                  </li>
                  <li>
                    <div className="d-flex gap-1 align-items-center justify-content-center py-2">
                      <span className="fs-13 text-muted">Theme</span>
                      <div
                        className="theme-toggle rounded-circle"
                        onClick={handleTheme}
                      ></div>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
