import { createSlice } from '@reduxjs/toolkit'

export const binanceFutureSlice = createSlice({
    name: 'binanceFuture',
    initialState: {
      value: null,
    },
    reducers: {
      binancefutureRedx: (state, action) => {
        // Correctly mutate the state property instead of reassigning state
        state.value = action.payload;
      },
    },
  })
  
  // Action creators are generated for each case reducer function
  export const { binancefutureRedx } = binanceFutureSlice.actions
  
  export default binanceFutureSlice.reducer