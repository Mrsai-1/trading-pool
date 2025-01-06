import { createSlice } from '@reduxjs/toolkit'

export const profileSlice = createSlice({
  name: 'profile',
  initialState: {
    value: null,
  },
  reducers: {
    profileRedux: (state, action) => {
      // Correctly mutate the state property instead of reassigning state
      state.value = action.payload;
    },
  },
})

// Action creators are generated for each case reducer function
export const { profileRedux } = profileSlice.actions

export default profileSlice.reducer
