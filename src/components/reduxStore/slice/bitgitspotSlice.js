import { createSlice } from '@reduxjs/toolkit'

export const bitgetSpotSlice = createSlice({
    name: 'bitgetSpot',
    initialState: {
      value: null,
    },
    reducers: {
        bitgetSpotRedx: (state, action) => {
        // Correctly mutate the state property instead of reassigning state
        state.value = action.payload;
      },
    },
  })
  
  // Action creators are generated for each case reducer function
  export const { bitgetSpotRedx } = bitgetSpotSlice.actions
  
  export default bitgetSpotSlice.reducer