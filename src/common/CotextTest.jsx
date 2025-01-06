import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { backEndCall, backEndCallObjNoDcyt, getJwt } from "../services/mainService";
import { profileRedux } from "../components/reduxStore/slice/profileSlice";


import Cardano from "../assets/images/cryptoIcons/cardano.png";
import near from "../assets/images/cryptoIcons/near.png";
import Usdc from "../assets/images/cryptoIcons/usdc.png";

import tether from "../assets/images/cryptoIcons/tether.png";
import apt from "../assets/images/cryptoIcons/apt.png";
import arb from "../assets/images/cryptoIcons/arb.jpeg";
import arm from "../assets/images/cryptoIcons/arm.png";
import ethereum from "../assets/images/cryptoIcons/Ethereum.png";
import avax from "../assets/images/cryptoIcons/avax.png";
import link from "../assets/images/cryptoIcons/link-1.png";
import zk from "../assets/images/cryptoIcons/zk.png";

import xtz from "../assets/images/cryptoIcons/xtz.png";
import xrp from "../assets/images/cryptoIcons/xrp.png";
import there from "../assets/images/cryptoIcons/there.png";
import shiba from "../assets/images/cryptoIcons/shiba-inu.png";
import sei from "../assets/images/cryptoIcons/sei.png";
import sxc from "../assets/images/cryptoIcons/sxc.png";
import pol from "../assets/images/cryptoIcons/pol.png";
import icp from "../assets/images/cryptoIcons/icp.png";
import dog from "../assets/images/cryptoIcons/dog.png";
import hbar from "../assets/images/cryptoIcons/hbar.png";
// import icp from "../assests/images/icp.png";
import ena from "../assets/images/cryptoIcons/ena.png";

import ton from "../assets/images/cryptoIcons/ton.png";
import axios from "axios";

const useFetchKeys = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [keysLoading, setKeysLoading] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const [apiKeys, setApiKeys] = useState(null);

  // Function to Fetch Keys
  const fetchKeys = async () => {
    if (keysLoading) return;

    try {
      setKeysLoading(true);
      const res = await backEndCall("/admin_get/profile");

      if (!res) return;

      setProfileData(res);
      setApiKeys(res.profile.api_keys || {});

      // Dispatch the profile data to Redux
      dispatch(profileRedux(res));

      const jwt = getJwt();
      if (jwt && Object.keys(res.profile.api_keys || {}).length > 0) {
        // setTimeout(() => navigate("/dashboard"), 200);
      } else {
        setTimeout(() => navigate("/api"), 200);
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setKeysLoading(false);
    }
  };

  const getCoinicons = (type = "") => {
    let result = type.replace("USDT", "").toLowerCase();
    if (type === "NEARUSDT") {
      return near;
    } else if (type === "ARBUSDT") {
      return arb;
    } else if (type === "LINK" || type === "LINKUSDT") {
      return link;
    } else if (type === "STX" || type === "STXUSDT") {
      return sxc;
    } else if (type === "HBAR" || type === "HBARUSDT") {
      return hbar;
    } else if (type === "ZKUSDT") {
      return Usdc;
    } else if (type === "NEAR") {
      return near;
    } else if (type === "APT" || type === "APTUSDT") {
      return apt;
    } else if (type === "ARB") {
      return arb;
    } else if (type === "TON" || type === "TONUSDT") {
      return ton;
    } else if (type === "USDT") {
      return tether;
    } else if (result === "xtz") {
      return xtz;
    } else if (result === "xrp") {
      return xrp;
    } else if (result === "pol") {
      return pol;
    } else if (result === "icp") {
      return icp;
    } else if (result === "dog") {
      return dog;
    } else if (result === "avax") {
      return avax;
    } else if (result === "arm") {
      return arm;
    } else if (result === "sei") {
      return sei;
    } else if (result === "ena") {
      return ena;
    } else if (result === "cardano") {
      return Cardano;
    } else if (result === "zk") {
      return zk;
    } else if (result === "shiba") {
      return shiba;
    } else {
      return tether;
    }
  };
  
  const getFormattedDate = (timestamp = "") => {
    if (!timestamp) return "";
    const date = new Date(timestamp);
    const formattedDate = date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
    return formattedDate;
  };

  const fetchData = async (formData, setLoading, reduxName) => {
    setLoading(true);
    try {
      const response = await backEndCallObjNoDcyt(
        "/trades/get_open_trades_data",
        formData
      );
      dispatch(reduxName(response)); // Dispatch the action to Redux
    } catch (error) {
      console.error("Error fetching open trades data:", error);
    } finally {
      setLoading(false);
    }
  };

  function formatToExactDecimals(value, decimalPlaces) {
   
    // Ensure the value is treated as a number
    value = Number(value);

    // Convert to a string and split at the decimal point
    const [integerPart, decimalPart = ""] = value.toString().split(".");

    // Pad or trim the decimal part to match the required decimal places
    const formattedDecimalPart = decimalPart.padEnd(decimalPlaces, "0").slice(0, decimalPlaces);

    // Combine integer and decimal parts
    return `${integerPart}.${formattedDecimalPart}`;
  }


   const getValuepp = async (pair) => {
    return await axios.get(
      `https://api.binance.com/api/v3/ticker/price?symbol=${pair}`,
      {
        headers: {
          'x-auth-token': undefined,
        },
      }
    );
  };
  

  // Return states and functions for use in components
  return { fetchKeys, keysLoading, profileData, apiKeys,getCoinicons ,getFormattedDate,fetchData ,formatToExactDecimals ,getValuepp };
};



export default useFetchKeys;

