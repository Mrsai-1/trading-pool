import CryptoJS from "crypto-js";

// Load environment variables
var [password, salt] = [
  process.env.REACT_APP_CRYPTO_PASS ,
  process.env.REACT_APP_CRYPTO_SALT ,
];

// Ensure salt is in correct format
var saltWordArray = CryptoJS.enc.Utf8.parse(salt);

// Derive key
var key;
try {
  key = CryptoJS.PBKDF2(password, saltWordArray, {
    keySize: 256 / 32,
    iterations: 100,
  });
} catch (error) {
  console.error("Error deriving key:", error);
}

const helpers = {
  encrypt: function (text) {
    try {
      return CryptoJS.AES.encrypt(text, key.toString()).toString();
    } catch (error) {
      return error;
    }
  },
  encryptobj: function (obj) {
    try {
      return CryptoJS.AES.encrypt(JSON.stringify(obj), key.toString()).toString();
    } catch (error) {
      return error;
    }
  },
  decrypt: function (encdata) {
    try {
      const datat = CryptoJS.AES.decrypt(encdata, key.toString());
      return datat.toString(CryptoJS.enc.Utf8);
    } catch (error) {
      return error;
    }
  },
  decryptobj: function (encdata) {
    try {
      const datatt = CryptoJS.AES.decrypt(encdata, key.toString());
      return JSON.parse(datatt.toString(CryptoJS.enc.Utf8));
    } catch (error) {
      return error;
    }
  },
};

export default helpers;
