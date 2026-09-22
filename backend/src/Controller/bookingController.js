import { Property } from "../Models/propertyModel.js";
import { Booking } from "../Models/bookingModel.js";

// Create order: booking any property
const createOrder = async (req, res) => {
    const { amount, propertyId, fromDate, toDate, guests } = req.body;

    const orderId = "order_" + Date.now();

    res.json({
        success: true,
        message: "Order created Successfully",
        orderId,
        amount,
        propertyId,
        fromDate,
        toDate,
        guests
    });
};

// Verify payment
const verifyPayment = async (req, res) => {
    try {
        const { orderId, bookingDetails, forceStatus } = req.body;

        if (forceStatus !== "success") {
            return res.status(400).json({
                success: false,
                message: "Payment Failed!",
                orderId
            });
        }

        const {
            propertyId,
            fromDate,
            toDate,
            price,
            guests,
            numberOfnights
        } = bookingDetails;

        // 1. Check property
        const property = await Property.findById(propertyId);

        if (!property) {
            return res.status(404).json({
                success: false,
                message: "Property not found"
            });
        }

        // 2. Convert dates properly
        const newFromDate = new Date(fromDate);
        const newToDate = new Date(toDate);

        // 3. Validate dates
        if (
            isNaN(newFromDate.getTime()) ||
            isNaN(newToDate.getTime())
        ) {
            return res.status(400).json({
                success: false,
                message: "Invalid booking dates"
            });
        }

        if (newFromDate >= newToDate) {
            return res.status(400).json({
                success: false,
                message: "Checkout date must be after check-in date"
            });
        }

        // 4. Check overlapping booking
        const alreadyBooked = await Booking.findOne({
    property: propertyId,
    paid: true,

    fromDate: {
        $type: "date",
        $lt: newToDate
    },

    toDate: {
        $type: "date",
        $gt: newFromDate
    }
});
        if (alreadyBooked) {
            return res.status(409).json({
                success: false,
                message:
                    "These dates are already booked. Please select different dates."
            });
        }

        // 5. Create payment ID
        const paymentId = "pay_" + Date.now();

        // 6. Create booking
        const newBooking = await Booking.create({
            user: req.user._id,
            property: propertyId,
            price,
            fromDate: newFromDate,
            toDate: newToDate,
            guests,
            numberOfNights: numberOfnights,
            paid: true
        });

        // 7. Save booking dates in property
        await Property.findByIdAndUpdate(
            propertyId,
            {
                $push: {
                    currentBookings: {
                        bookingId: newBooking._id,
                        fromDate: newFromDate,
                        toDate: newToDate,
                        userId: req.user._id
                    }
                }
            },
            { new: true }
        );

        // 8. Success
        res.status(200).json({
            success: true,
            message: "Payment successful, booking confirmed !!",
            paymentId,
            orderId,
            booking: newBooking
        });

    } catch (error) {
        console.error("Verify payment error:", error);

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get my bookings
const getUserBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({
            user: req.user._id
        });

        res.status(200).json({
            status: "success",
            data: {
                bookings
            }
        });

    } catch (error) {
        res.status(401).json({
            status: "fail",
            message: error.message
        });
    }
};

// Get booking details
const getBookingDetails = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.bookingId);

        res.status(200).json({
            status: "success",
            data: {
                booking
            }
        });

    } catch (error) {
        res.status(401).json({
            status: "fail",
            message: error.message
        });
    }
};

export {
    getBookingDetails,
    getUserBookings,
    createOrder,
    verifyPayment
};