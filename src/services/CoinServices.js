import { useState } from "react";
import { backEndCall, backEndCallObj } from "./mainService";


const getCoins = async () => {
    try {
      const data = await backEndCall("/admin_get/get_coins");
      if (data) {
        return data;
      }
      return null;
    } catch (error) {
      console.error("Error fetching coins:", error);
      return null;
    }

};

const addCoins = async (payload) => {

  const response = await backEndCallObj("/admin/add_coin",payload ); //payload

  if (!response) return null;
  return response;
};
const updateCoins = async (payload) => {
  const data = await backEndCallObj("/admin/edit_coin",payload );
  if (!data) return null;
  return data;
};
const deleteCoins = async (payload) => {
  const data = await backEndCallObj("/admin/edit_coin",payload );
  if (!data) return null;
  return data;
};

//admincontrolssettting

const coinService = {
  getCoins,
  updateCoins,
  deleteCoins,
  addCoins,
};



export default coinService;
