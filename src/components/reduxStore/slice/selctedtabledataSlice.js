import { createSlice } from '@reduxjs/toolkit'

export const selectedtabledata = createSlice({
    name: 'selectedtabledata',
    initialState: {
     currentData: [],
     type:'',
     platform:'',
    },
    reducers: {
     setTableData: (state, action) => {
      state.currentData = action.payload.currentData;
      state.type = action.payload.type;
      state.platform = action.payload.platform;
     },
    },
  })
  
  // Action creators are generated for each case reducer function
  export const { setTableData , toggleOppositeData } = selectedtabledata.actions
  
  export default selectedtabledata.reducer;