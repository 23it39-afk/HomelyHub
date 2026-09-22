import express from "express";

import {
    getBookingDetails,
    getUserBookings,
    createOrder,
    verifyPayment
} from "../Controller/bookingController.js";

import { protect } from "../Controller/authController.js";

const bookingRouter = express.Router();

bookingRouter.get("/", protect, getUserBookings);

bookingRouter.get("/:bookingId", protect, getBookingDetails);

bookingRouter.post("/create-order", protect, createOrder);

bookingRouter.post("/verify-payment", protect, verifyPayment);

export { bookingRouter };