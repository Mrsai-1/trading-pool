import { createSlice } from '@reduxjs/toolkit'

export const bitgetFutureSlice = createSlice({
    name: 'bitgetFuture',
    initialState: {
      value: null,
    },
    reducers: {
      bitgetFutureRdx: (state, action) => {
        // Correctly mutate the state property instead of reassigning state
        state.value = action.payload;
      },
    },
  })
  
  // Action creators are generated for each case reducer function
  export const { bitgetFutureRdx } = bitgetFutureSlice.actions
  
  export default bitgetFutureSlice.reducer