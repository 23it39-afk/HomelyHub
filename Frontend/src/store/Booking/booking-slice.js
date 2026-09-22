import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  bookings: [],
  bookingDetails: {},
  loading: false,
};

const bookingSlice = createSlice({
  name: "booking",
  initialState,
  reducers: {
    setBookingRequest(state) {
      state.loading = true;
    },

    setBooking(state, action) {
      state.bookings = action.payload;
      state.loading = false;
    },

    addBooking(state, action) {
      state.bookings.push(action.payload);
    },

    setBookingDetails(state, action) {
      state.bookingDetails = action.payload;
    },
  },
});

export const {
  setBookingRequest,
  setBooking,
  addBooking,
  setBookingDetails,
} = bookingSlice.actions;

export default bookingSlice;