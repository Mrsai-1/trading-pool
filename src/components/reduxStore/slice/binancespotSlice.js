import { createSlice } from '@reduxjs/toolkit'

export const binanceSpotSlice = createSlice({
    name: 'binanceSpot',
    initialState: {
      value: null,
    },
    reducers: {
      binancespotRedx: (state, action) => {
        // Correctly mutate the state property instead of reassigning state
        state.value = action.payload;
      },
    },
  })
  
  // Action creators are generated for each case reducer function
  export const { binancespotRedx } = binanceSpotSlice.actions
  
  export default binanceSpotSlice.reducer