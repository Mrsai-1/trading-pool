import { createSlice } from '@reduxjs/toolkit'

export const coinListSlice = createSlice({
    name: 'CoinsList',
    initialState: {
      value: null,
    },
    reducers: {
        coinListRdx: (state, action) => {
        // Correctly mutate the state property instead of reassigning state
        state.value = action.payload;
      },
    },
  })
  
  // Action creators are generated for each case reducer function
  export const { coinListRdx } = coinListSlice.actions
  
  export default coinListSlice.reducer