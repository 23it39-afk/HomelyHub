import { createSlice } from "@reduxjs/toolkit";

const propertyDetailSlice = createSlice({
  name: "propertyDetail",

  initialState: {
    property: null,
    loading: false,
    error: null,
  },

  reducers: {
    getRequest(state) {
      state.loading = true;
      
    },

    getPropertyDetails(state, action) {
      state.property = action.payload;
      state.loading = false;
     
    },

    getError(state, action) {
      state.error = action.payload;
      state.loading = false;
    }

   
  }
});

export const propertyDetailAction = propertyDetailSlice.actions;
export default propertyDetailSlice.reducer;