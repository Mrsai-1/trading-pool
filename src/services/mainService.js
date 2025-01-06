import http from './httpService';
import helpers from './cryptos';
import { jwtDecode } from 'jwt-decode';
const tokenKey = 'k-token';

const apiUrl = process.env.REACT_APP_API_URL;
const apiUrlAdmin = process.env.REACT_APP_API_URL_ADMIN;

export async function backEndCall(route) {
  updtk();
  const { data } = await http.post(apiUrl + route);

  return helpers.decryptobj(data);
}

export async function backEndCallNoEnc(route) {
  updtk();
  const { data } = await http.post(apiUrl + route);
  return data;
}

export async function testBackendcall(type) {
  return new Promise((resolve, reject) => {
    if (type === 'fail') {
      let response = { response: { data: 'Something went wrong' } };
      reject(JSON.stringify(response));
    } else {
      resolve({ success: 'Success!' });
    }
  });
}

export async function backEndCallObjNoEnc(route, obj) {
  updtk();
  const { data } = await http.post(apiUrl + route, obj);
  return helpers.decryptobj(data);
}

export async function backEndCallObj(route, obj) {
  updtk();
  const drreqpob = helpers.encryptobj(obj);
  const { data } = await http.post(apiUrl + route, {
    enc: drreqpob,
  });
  return helpers.decryptobj(data);
}
export async function backEndCallObjCap(route, obj, cap) {
  updtk();
  await http.setCaptcha(cap);
  const drreqpob = helpers.encryptobj(obj);
  const { data } = await http.post(apiUrl + route, {
    enc: drreqpob,
  });
  return helpers.decryptobj(data);
}

export async function backEndCallObjAdmin(route, obj) {
  updtk();
  const drreqpob = helpers.encryptobj(obj);
  const { data } = await http.post(apiUrlAdmin + route, {
    enc: drreqpob,
  });
  return helpers.decryptobj(data);
}

export async function backEndCallObjNoDcyt(route, obj) {
  updtk();
  const drreqpob = helpers.encryptobj(obj);
  const { data } = await http.post(apiUrl + route, {
    enc: drreqpob,
  });

  return data;
}

export async function backEndCallObjCaptcha(route, obj, captcha) {
  updtk();
  // http.setJwt(captcha);
  const drreqpob = helpers.encryptobj(obj);
  const { data } = await http.post(apiUrl + route, {
    enc: drreqpob,
  });
  return helpers.decryptobj(data);
}

export function setLocalToken(token) {
  localStorage.setItem(tokenKey,token);
}

export function getJwt() {
  return localStorage.getItem(tokenKey);
}

export async function updtk() {
  const token = getJwt();
  if (!token) {
    // console.warn('No Token in header');
  }
  await http.setJwt(getJwt());
}

export function logout() {
  localStorage.clear();

  // window.location = '/';
}

export function getCurrentUser() {
  try {
    // const clientip = localStorage.getItem('k-ip');
    const tttre = localStorage.getItem(tokenKey);
    if (tttre) {
      const jwt = helpers.decrypt(tttre);

      const some = jwtDecode(jwt);

      if (
        some.exp >=
        Date.now() / 1000
        // &&
        // some.last_login_ip === clientip
        //  &&
        // some.browserid === browser.version
      ) {
        return some;
      } else {
        logout();
      }
    } else {
      return null;
    }
  } catch (ex) {
    return null;
  }
}



const exportedObject = {
  backEndCall,
  backEndCallObj,
};

export default exportedObject;
