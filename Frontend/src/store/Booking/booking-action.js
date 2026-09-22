
import { axiosInstance } from "../../utils/axios";
import { setBookingDetails, setBooking } from "./booking-slice";

// Fetch booking details
export const fetchBookingDetails = (bookingId) => async (dispatch) => {
  try {
    const response = await axiosInstance.get(
      `/v1/rent/user/booking/${bookingId}`
    );

   dispatch(setBookingDetails(response.data.data.booking));
  } catch (error) {
    console.error("Error fetching booking details", error);
  }
};

// Fetch user bookings
export const fetchUserBookings = () => async (dispatch) => {
  try {
    const response = await axiosInstance.get("/v1/rent/user/booking");

    dispatch(setBooking(response.data.data.bookings));
  } catch (error) {
    console.error("Error fetching bookings", error);
  }
};