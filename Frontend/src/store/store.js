import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./User/user-slice"
import propertySlice from "./Property/property-slice";
import PropertyDetailsSlice from "./PropertyDetails/PropertyDetails-slice";
import bookingSlice from "./Booking/booking-slice";
import accomodationSlice from "./Accomodation/Accomodation-slice";
import paymentSlice from "./Payment/payment-slice"

const store = configureStore({

  reducer: {
    properties: propertySlice,
    propertydetails: PropertyDetailsSlice,
    user: userSlice,
    booking: bookingSlice.reducer,
    accomodation:accomodationSlice.reducer,
    payment: paymentSlice.reducer,
  },
});

export default store;