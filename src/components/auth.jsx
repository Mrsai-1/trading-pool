import React, { useState, useEffect, useRef } from "react";

import Form from "../basic/form";
import Joi from "joi-browser";
import {
  backEndCall,
  backEndCallObj,
  setLocalToken,
  getJwt,
} from "../services/mainService";
import { toastFun } from "../basic/toast";
import { pushRoute } from "../services/pushRoute";

class Auth extends Form {
  state = {
    isOtpView: false,
    data: {
      email: "",
      password: "",
    },
    errors: {},
    btnDisable: true,
    otp: "", // Initialize as an array of 6 empty strings
    showPassword: false,
  };

  schema = {
    email: Joi.string().min(5).max(40).required().label("Email"),
    password: Joi.string()
      .required()
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/)
      .options({
        language: {
          string: {
            regex: {
              base: "Must contain at least 1 lowercase,1 uppercase alphabetical,1 numeric and one special Character",
              test: "another description",
            },
          },
        },
      })
      .label("Password"),
  };

  loginVerifyOTP = async (e) => {
    if (e) e.preventDefault();
    const { data } = this.state;
    const { navigate } = this.props;
    try {
      this.setState({ btnDisable: false });

      const { otp } = this.state || "";

      if (otp.length < 6) {
        toastFun("Please Enter 6-Digits OTP", "error");
        this.setState({ btnDisable: true });
        return;
      }

      const obj = {
        otp: otp.join(""), // Converts the otp array into a JSON string
        email: data?.email,
      };


      const res = await backEndCallObj("/admin/verify_login", obj);
      if (res) {
        setLocalToken(res.jwt);
        if (res.jwt) {
          setTimeout(() => {
            navigate("/dashboard");
          }, 200);
        }
      }
    } catch (error) {
      this.setState({ btnDisable: true });
      toastFun(error?.response?.data, "error");
    }
  };

  doSubmit = async () => {
    try {
      const { data } = this.state;
      this.setState({ btnDisable: false });
      const res = await backEndCallObj("/admin/login", data);
      this.setState({ isOtpView: true, btnDisable: true });
    } catch (error) {
      this.setState({ btnDisable: true });
      toastFun(error?.response?.data, "error");
    }
  };

  togglePasswordVisibility = () => {
    this.setState((prevState) => ({ showPassword: !prevState.showPassword }));
  };

  render() {
    const { isOtpView, btnDisable, data, errors } = this.state;
    return (
      <>
        <>
          {isOtpView ? (
            <div className="min-vh-100 d-flex justify-content-center align-items-center">
              <div className="background">
                <div className="shape blue"></div>
                <div className="shape orange"></div>
              </div>
              <div className="otp-container gap-2">
                <header className="header-otp">
                  <i className="bx bxs-check-shield"></i>
                </header>
                <h4 className="mt-2">Enter OTP Code</h4>
                <form onSubmit={this.loginVerifyOTP} className="otp-form">
                  <div className="input-field d-flex">
                    {Array.from({ length: 6 }, (_, index) => (
                      <input
                        key={index}
                        type="text"
                        maxLength="1"
                        value={this.state.otp[index] || ""}
                        onChange={(e) => {
                          const otp = [...this.state.otp]; // Copy the OTP array
                          otp[index] = e.target.value.replace(/[^\d]/g, ""); // Replace non-digit characters
                          this.setState({ otp });

                          // Move focus to the next input after entering a digit
                          if (otp[index] !== "" && index < 5) {
                            const nextInput =
                              document.querySelectorAll(".input-field input")[
                                index + 1
                              ];
                            if (nextInput) nextInput.focus();
                          }
                        }}
                        onKeyDown={(e) => {
                          // Handle backspace to focus the previous input
                          if (
                            e.key === "Backspace" &&
                            index > 0 &&
                            !this.state.otp[index]
                          ) {
                            e.preventDefault();
                            const prevInput =
                              document.querySelectorAll(".input-field input")[
                                index - 1
                              ];
                            if (prevInput) prevInput.focus();
                          }
                        }}
                        autoFocus={index === 0} // Auto-focus on the first input field
                      />
                    ))}
                  </div>

                  <button
                    type="submit"
                    className={`verify-btn ${btnDisable ? "active" : ""}`}
                    disabled={!btnDisable}
                  >
                    {btnDisable ? "Verify OTP" : "Please Wait"}
                  </button>
                  <button
                    type="button"
                    className="switch"
                    onClick={() => this.setState({ isOtpView: false })}
                  >
                    Back to Login
                  </button>
                </form>
              </div>
            </div>
          ) : (
            <>
              <div className="background">
                <div className="shape blue"></div>
                <div className="shape orange"></div>
              </div>
              <form className="LoginForm" onSubmit={this.handleSubmit}>
                <h3 className="mb-3">Login Here</h3>
                <div className="w-100 block">
                  <label className="loginLabel" htmlFor="username">
                    Email
                  </label>
                  <input
                    className="loginInput"
                    type="text"
                    value={data?.email}
                    onChange={this.handleChange}
                    name="email"
                    placeholder="Email or Phone"
                    id="username"
                  />
                  <p className="fs-13 text-light">{errors?.email}</p>
                </div>

                <div className="w-100 block">
                  <label className="loginLabel" htmlFor="password">
                    Password
                  </label>
                  <input
                    className="loginInput"
                    type={this.state.showPassword ? "text" : "password"}
                    name="password"
                    value={data?.password}
                    onChange={this.handleChange}
                    placeholder="Password"
                    id="password"
                  />
                  <span onClick={this.togglePasswordVisibility}>
                    <i
                      className={`fas ${
                        this.state.showPassword ? "fa-eye-slash" : "fa-eye"
                      }`}
                    ></i>
                  </span>
                  <p className="fs-13 text-light">{errors?.password}</p>
                </div>

                <button
                  type="submit"
                  className="LoginButton"
                  disabled={!btnDisable}
                  // className='text-center'
                  onClick={this.handleSubmit}
                >
                  {btnDisable ? "Log In" : "please wait"}
                </button>

                <div className="social">
                  <div className="go">
                    <i className="fab fa-google"></i> Google
                  </div>
                  <div className="fb">
                    <i className="fab fa-facebook"></i> Facebook
                  </div>
                </div>
              </form>
            </>
          )}
        </>
      </>
    );
  }
}

export default pushRoute(Auth);
