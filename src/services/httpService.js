import axios from 'axios';

// import userService from "./auth/login/userService";
// var jwtoken = require("jsonwebtoken"
axios.interceptors.response.use(null, (error) => {
  // const expectedError =
  //   error.response &&
  //   error.response.status >= 400 &&
  //   error.response.status < 500;

  // if (!expectedError) {
  //   toast.error("Oops! Something went wrong.");
  // }

  const logError = error.response && error.response.status === 440;

  if (logError) {
    // logout();
    window.location = '/';
  }

  return Promise.reject(error);
});

function setJwt(jwt) {
  // var tokto = jwtoken.sign(
  //   {
  //     exp: Math.floor(Date.now() / 1000) + 10,
  //     data: window.location.href,
  //   },
  //   process.env.REACT_APP_CSRF
  // );

  axios.defaults.headers.common['x-auth-token'] = jwt;
}
function setCaptcha(captcha) {
  axios.defaults.headers.common['x-captcha-token'] = captcha;
}

const exportedObject = {
  get: axios.get,
  post: axios.post,
  put: axios.put,
  delete: axios.delete,
  setJwt,
  setCaptcha,
};

export default exportedObject;
