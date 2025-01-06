import React from "react";
import { Link } from "react-router-dom";
import Joi from "joi-browser";
import Form from "../basic/form"; // Import the Form base class
import { backEndCallObj, getJwt, setLocalToken } from "../services/mainService";
import { toast } from "react-toastify";
import tradingBott from "../assets/images/tradingbott.webp";
import mainLogoLight from "../assets/images/7pools-logo.png";
import navyBlueIcon from "../assets/images/logos/navi-blue.png";
import navyWhiteIcon from "../assets/images/logos/navi-white.png";
import whiteIcon from "../assets/images/logos/logo-white2.png";
import { pushRoute } from "../services/pushRoute";

class Login extends Form {
  state = {
    data: { email: "", password: "" },
    errors: {},
    isLogin: true,
    btnDisable: false,
    otp: "",
  };

  // Joi validation schema
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
            },
          },
        },
      })
      .label("Password"),
  };


  // Handle login submit
  doSubmit = async () => {
    const { email, password } = this.state.data;
    if (this.state.isLogin) {
      if (!email || !password) {
        toast.warning("Please enter email and password", "error");
        return;
      }
      this.setState({ btnDisable: true });

      try {
        const res = await backEndCallObj("/admin/login", this.state.data);
        this.setState({ isLogin: false });
        toast.success("OTP Sent Successfully!", "success");
      } catch (error) {
        toast.error(error?.response?.data || "Login Failed", "error");
      } finally {
        this.setState({ btnDisable: false });
      }
    } else {
      const { otp } = this.state;
      const { navigate } = this.props;
      if (otp.length !== 6) {
        toast.warning("Please Enter a 6-Digit OTP", "error");
        return;
      }

      const obj = { otp, email: this.state.data.email };

      this.setState({ btnDisable: true });
      try {
        const res = await backEndCallObj("/admin/verify_login", obj);
        if (res) {
          setLocalToken(res?.jwt);
          if (res.jwt) {
            setTimeout(() => {
              navigate("/dashboard");
            }, 200);
          }
        }
      } catch (error) {
        toast.error(
          error?.response?.data || "OTP Verification Failed",
          "error"
        );
      } finally {
        this.setState({ btnDisable: false });
      }
    }
  };









  render() {
    const { data, otp, errors, btnDisable, isLogin } = this.state;



 


    return (
      <div className="login">
        <div className="d-flex justify-content-center pe-5 position-relative">
          <img
            className="logoImg position-absolute"
            src={whiteIcon}
            alt="7pools-logo"
            width={170}
          />
        </div>
        <div className="row align-items-center justify-content-center">
          <div className="col-xl-5 col-lg-5 d-none d-lg-flex login-leftside-content flex-column align-items-center justify-content-center fx-white">
            <img
              className="trading-bot-img"
              src={tradingBott}
              alt="trading-bot"
            />
            <div className="text-center">
              <h4 className="fw-bold secondary-color">Enroll Smart Trading</h4>
              <p className="muted-text fs-14">
                Empowering your trades with precision and <br /> automation –
                the ultimate trading bot solution.
              </p>
            </div>
          </div>

          <div className="col-xl-4 col-lg-5 col-md-6 col-sm-8 col-11">
            <form>
              <div className="d-flex flex-column align-items-center justify-content-center login-credentials-wrapper rounded px-4 px-lg-5 py-5">
                {this.state.isLogin ? (
                  <>
                    <h4 className="mb-0 fw-bold">Welcome back</h4>
                    <p className="mb-5 fs-13">Please enter your details</p>
                    <div className="inputGroup field mb-4">
                      <input
                        className="inputField px-2"
                        type="input"
                        value={data.email}
                        placeholder="Name"
                        name="email"
                        id="userEmail"
                        required=""
                        onChange={this.handleChange}
                        autoComplete="off"  // Workaround for password and other fields
                      />
                      <label htmlFor="userEmail" className="inputLabel">
                        Email
                      </label>
                      <span className="mb-0 fs-13 text-danger">
                        {errors?.email}
                      </span>
                    </div>

                    <div className="inputGroup field mb-4">
                      <input
                        className="inputField px-2"
                        type="password"
                        name="password"
                        value={data.password}
                        placeholder="Password"
                        id="userPassword"
                        required=""
                        onChange={this.handleChange}
                        autoComplete="new-password"   // Workaround for password and other fields
                      />
                      <label htmlFor="userPassword" className="inputLabel">
                        Password
                      </label>
                      <span className="fs-13 text-danger">
                        {errors?.password}
                      </span>
                    </div>
                  </>
                ) : (
                  <>
                    <h4 className="mb-5 primary-color fw-bold">Enter OTP</h4>
                    <div className="inputGroup field mb-4">
                      <input
                        className="inputField px-2"
                        type="text"
                        placeholder="OTP"
                        id="userOtp"
                        value={otp}
                        maxLength={6}
                        name="otp"
                        required=""
                        onChange={(e) =>
                          this.setState({
                            otp: e.target.value.replace(/[^\d\.]/g, ""),
                          })
                        }
                      />
                      <label htmlFor="userOtp" className="inputLabel">
                        OTP
                      </label>
                    </div>
                  </>
                )}
                {/* <Link to="" className="fs-13 ms-auto mb-2 primary-color">
                  Forgot password?
                </Link> */}

                <div className="w-100 my-3 d-flex justify-content-center transition transition-width">
                  <button
                    className={btnDisable ? "w-ft-content" : "w-100"}
                    onClick={this.handleSubmit}
                    disabled={btnDisable}
                  >
                    {btnDisable ? (
                      <span className="spinner-border spinner-border-sm" aria-hidden="true"></span>
                    ) : (
                      <span>{isLogin ? "Login" : "Verify OTP"}</span>
                    )}
                  </button>
                </div>

                {/* <div className="my-3">
                  <span className="fs-13">Are you new? </span>
                  <Link to="" className="fs-13 ms-auto mb-2 primary-color">
                    Create an Account
                  </Link>
                </div> */}
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

export default pushRoute(Login);
