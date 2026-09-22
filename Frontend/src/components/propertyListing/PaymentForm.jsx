import React, { useState } from "react";
import { useForm } from "@tanstack/react-form";
import { DatePicker, Space } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import dayjs from "dayjs";
import { setPaymentDetails } from "../../store/Payment/payment-slice";

const PaymentForm = ({
  price,
  propertyName,
  address,
  maximumGuest,
  propertyId,
  currentBookings,
}) => {
  const [calculatedPrice, setCalulatedPrice] = useState(0);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { RangePicker } = DatePicker;
  const { isAuthenticated } = useSelector((state) => state.user);

  const isDateDisabled = (current) => {
  if (!current) {
    return false;
  }

  // Past dates disable
  if (current.isBefore(dayjs().startOf("day"), "day")) {
    return true;
  }

  // Already booked dates disable
  return (currentBookings || []).some((booking) => {
    if (!booking.fromDate || !booking.toDate) {
      return false;
    }

    const startDate = dayjs(booking.fromDate).startOf("day");
    const endDate = dayjs(booking.toDate).startOf("day");
    const currentDate = current.startOf("day");

    if (!startDate.isValid() || !endDate.isValid()) {
      return false;
    }

    return (
      currentDate.valueOf() >= startDate.valueOf() &&
      currentDate.valueOf() < endDate.valueOf()
    );
  });
};
  const form = useForm({
    defaultValues: {
      dateRange: [],
      guests: "",
      name: "",
      phoneNumber: "",
    },
    onSubmit: async ({ value }) => {
      const [checkinDate, checkoutDate] = value.dateRange;
      const nights = moment(checkoutDate).diff(moment(checkinDate), "days");
      const { name, guests, phoneNumber } = value;
      if (name && guests && phoneNumber && checkinDate && checkoutDate) {
        await dispatch(
          setPaymentDetails({
            checkinDate: checkinDate,
            checkoutDate: checkoutDate,
            nights,
            totalPrice: calculatedPrice,
            propertyName,
            address,
            guests: Number(guests),
            name,
            phoneNumber,
          })
        );
        navigate(`/payment/${propertyId}`);
      } else {
        alert("Please fill all fields correctly before proceeding.");
      }
    },
  });

  return (
    <div className="form-container">
      <form
        className="payment-form"
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
      >
        <div className="price-pernight">
          Price: <b>&#8377;{price}</b>
          <span> / Per night</span>
        </div>
        <div className="payment-field">
          <form.Field name="dateRange">
            {(field) => (
              <div className="date">
                <Space direction="vertical" size={12}>
                  <RangePicker
                    format="YYYY-MM-DD"
                    picker="date"
                    disabledDate={isDateDisabled}
                    onChange={(value, dateString) => {
                      field.handleChange(dateString);
                      const [checkin, checkout] = dateString;
                      if (checkin && checkout) {
                        const nights = moment(checkout, "YYYY-MM-DD").diff(
                          moment(checkin, "YYYY-MM-DD"),
                          "days"
                        );
                        const total = price * nights;
                        setCalulatedPrice(total);
                      } else {
                        setCalulatedPrice(0);
                      }
                    }}
                  />
                </Space>
              </div>
            )}
          </form.Field>
          <form.Field
            name="guests"
            validators={{
              onChange: ({ value }) =>
                value > 0 && value <= maximumGuest
                  ? undefined
                  : `Guests must be 1 - ${maximumGuest}`,
            }}
          >
            {(field) => (
              <div className="guest">
                <label className="payment-labels">Number of guests:</label>
                <br></br>
                <input
                  type="number"
                  className="no-of-guest"
                  placeholder="Guest"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                ></input>
                {field.state.meta.errors && (
                  <p style={{ color: "red" }}>{field.state.meta.errors}</p>
                )}
              </div>
            )}
          </form.Field>
          <div className="name-phoneno">
            <form.Field name="name">
              {(field) => (
                <>
                  <label className="payment-labels">Your full name:</label>{" "}
                  <br></br>
                  <input
                    type="text"
                    className="full-name"
                    placeholder="Name"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                  ></input>
                </>
              )}
            </form.Field>
            <br></br>
            <form.Field name="phoneNumber">
              {(field) => (
                <>
                  <label className="payment-labels">Phone Number:</label>{" "}
                  <br></br>
                  <input
                    type="number"
                    className="phone-number"
                    placeholder="Number"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                  ></input>
                </>
              )}
            </form.Field>
          </div>
        </div>
        <div className="book-place">
          {!isAuthenticated ? (

            <button type="button" onClick={() => navigate("/login")}>
              Login to Book
            </button>
          ) : (
            <button>Book this place &#8377; {calculatedPrice}</button>
          )}
        </div>
      </form>
    </div>
  );
};

export default PaymentForm;
